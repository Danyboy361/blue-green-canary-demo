# Zero-Downtime Deployment with Blue/Green & Canary Strategies

A student demo based on Step 6 of the assignment guide. It runs two Node.js services in Docker and routes traffic through Nginx.

## Requirements
- Docker Desktop running
- Git (optional, for GitHub Actions)
- A web browser

## 1. Project structure
```text
blue-green-canary-demo/
├── app/
│   ├── v1/
│   │   ├── server.js
│   │   ├── package.json
│   │   └── Dockerfile
│   └── v2/
│       ├── server.js
│       ├── package.json
│       └── Dockerfile
├── nginx/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── blue.conf
│   └── green.conf
├── .github/workflows/ci-cd.yml
├── docker-compose.yml
└── .dockerignore
```

## 2. Run the application
Open a terminal in this folder and run:
```bash
docker compose up --build -d
```
Wait for the containers to start, then open:
- http://localhost:8080

The default Nginx configuration is **Canary 95/5**: most requests go to v1 (Blue), and a small proportion go to v2 (Green/Canary). Because routing is weighted, a short series of requests may not visibly show both versions every time.

To view logs:
```bash
docker compose logs -f
```
Stop the application:
```bash
docker compose down
```

## 3. Test the canary split
Run this in PowerShell from the project folder:
```powershell
1..100 | ForEach-Object { (Invoke-WebRequest -UseBasicParsing http://localhost:8080).Content } | Group-Object | Select-Object Name, Count
```
This sends 100 requests and groups the response text by version. The exact counts can vary.

## 4. Switch to Blue/Green routing
The provided configuration files show the two single-version modes. To switch:
1. Open `nginx/nginx.conf`.
2. Replace its contents with the contents of **one** file:
   - `nginx/blue.conf` to route all traffic to v1 (Blue), or
   - `nginx/green.conf` to route all traffic to v2 (Green).
3. Apply the change without stopping the app:
```bash
docker compose exec nginx nginx -s reload
```
4. Refresh http://localhost:8080 to verify the selected version.

To return to Canary mode, restore the original `nginx/nginx.conf` from the included canary configuration shown in that file's Git history, or copy the 95/5 upstream from the original file below.

## 5. GitHub Actions CI workflow
The workflow at `.github/workflows/ci-cd.yml` runs on pushes to `main` and pull requests. It checks out the repository and builds the v1, v2, and Nginx Docker images. This is a **build/validation pipeline**, not a cloud deployment; publishing images and deploying to a cloud host would require registry credentials and a deployment target.

## 6. Suggested evidence/screenshots for submission
Take screenshots of:
1. Project folder and files.
2. `docker compose up --build -d` completing successfully.
3. Browser at `http://localhost:8080` showing v1 or v2 response.
4. PowerShell test showing response counts for the canary split.
5. GitHub Actions workflow run showing a successful build (after pushing to GitHub).

## 7. Concepts to explain
- **Blue/Green:** keep the current and new versions running in parallel; switch all traffic at once. Rollback by switching traffic back.
- **Canary:** send a small percentage of traffic to the new version, monitor it, and gradually increase its share if metrics are healthy.
- **Nginx:** reverse proxy that routes incoming requests to the app containers.
- **Docker Compose:** runs the two app containers and Nginx together.
- **CI/CD:** GitHub Actions automatically builds the container images when code changes.

## Notes
- This is a local learning demo. The compose setup keeps all three services running, which is useful for instant routing changes.
- The app endpoints are intentionally simple and return their version name.
- The canary percentage is a routing weight, not a guarantee of exact counts in every small sample.
