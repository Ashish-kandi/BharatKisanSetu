from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import dimod
import neal

app = Flask(__name__)
# Allow only your frontend origin (React dev server runs on port 3000)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# ------------------------
# Helper Functions
# ------------------------

def create_distance_matrix(locations):
    """
    Create pairwise Euclidean distance matrix from a list of dicts: [{'lat':.., 'lng':..}, ...]
    """
    coords = np.array([[loc['lat'], loc['lng']] for loc in locations])
    dist_matrix = np.linalg.norm(
        coords[:, None, :] - coords[None, :, :], axis=2
    )
    return dist_matrix

def build_tsp_qubo(dist_matrix, penalty=1000):
    """
    Build a QUBO model for the Travelling Salesman Problem (TSP).
    """
    n = len(dist_matrix)
    Q = {}

    # Constraint 1: Each city appears exactly once
    for i in range(n):
        for j in range(n):
            Q[((i, j), (i, j))] = -penalty
            for k in range(j+1, n):
                Q[((i, j), (i, k))] = 2 * penalty

    # Constraint 2: Each position in the tour has exactly one city
    for j in range(n):
        for i in range(n):
            for k in range(i+1, n):
                Q[((i, j), (k, j))] = 2 * penalty

    # Objective: Minimize total travel distance
    for i in range(n):
        for j in range(n):
            for k in range(n):
                next_j = (j + 1) % n
                key1 = (i, j)
                key2 = (k, next_j)
                if key1 <= key2:
                    Q[(key1, key2)] = Q.get((key1, key2), 0) + dist_matrix[i][k]

    return dimod.BinaryQuadraticModel.from_qubo(Q)

def decode_solution(sample, n):
    """
    Convert sampler binary result into an ordered list of city indices.
    """
    position_city = [None] * n
    for (city, pos), val in sample.items():
        if val == 1:
            position_city[pos] = city
    return position_city

# ------------------------
# API Endpoint
# ------------------------

@app.route("/api/quantum_route_optimize", methods=["POST"])
def optimize_route():
    """
    POST JSON example:
    {
        "locations": [
            {"lat":17.43, "lng":78.42},   // Farm
            {"lat":17.45, "lng":78.41},   // Consumer 1
            {"lat":17.44, "lng":78.43}    // Consumer 2
        ]
    }
    """
    data = request.get_json()
    locations = data.get("locations", [])

    if len(locations) < 2:
        return jsonify({"error": "At least two locations are required"}), 400

    try:
        # Step 1: Create distance matrix
        dist_matrix = create_distance_matrix(locations)

        # Step 2: Build QUBO
        bqm = build_tsp_qubo(dist_matrix)

        # Step 3: Solve with simulated annealing
        sampler = neal.SimulatedAnnealingSampler()
        sampleset = sampler.sample(bqm, num_reads=100)
        best_sample = sampleset.first.sample

        # Step 4: Decode to get city visiting order
        n = len(locations)
        best_route_indices = decode_solution(best_sample, n)
        optimized_route = [locations[i] for i in best_route_indices]

        # Step 5: Remove the farm (assume farm is first in input list)
        optimized_consumer_route = [
            loc for loc in optimized_route if loc != locations[0]
        ]

        # Step 6: Compute total route distance only for consumers
        consumer_indices = [best_route_indices[i] for i in range(n) if best_route_indices[i] != 0]
        total_distance = float(sum(
            dist_matrix[consumer_indices[i]][consumer_indices[(i + 1) % len(consumer_indices)]]
            for i in range(len(consumer_indices))
        ))

        return jsonify({
            "optimized_route": optimized_consumer_route,
            "total_distance": total_distance,
            "status": "success"
        })

    except Exception as e:
        return jsonify({"error": f"Optimization failed: {str(e)}"}), 500

# ------------------------
# Run Server
# ------------------------

if __name__ == "__main__":
    # Development mode
    # app.run(port=5100, debug=True)

    # Production: Waitress (Windows-friendly WSGI server)
    from waitress import serve
    serve(app, host="0.0.0.0", port=5100)
