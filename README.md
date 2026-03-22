# Job-Processing-System
A full-stack background job processing system built with FastAPI and React. Submit jobs, watch them get processed in real time with live status updates via polling.

Setup Backend :- 
move to project directory and inside it to backend directory  // e.g :- cd D:\jobbi\backend
python -m pip install -r requirements.txt                    //install python library to run backend
python -m uvicorn main:app --reload                         // starts the backend as a server

For Frontend :- 
move to frontend directory                    //e.g :- cd D:\jobbi\frontend
npm install
npm run dev


Error Handlings :- 

On the backend, schemas.py automatically rejects any invalid request before it touches the database — if someone sends an empty job name or a duration outside the 5-30 second range, FastAPI returns a 422 error instantly. 
Inside the worker, every job is wrapped in a try/except block — if anything crashes while processing a job, it gets marked as failed with a timestamp instead of getting stuck in processing forever. This means if anything unexpected happens it does not get block start from next.
On the frontend, JobForm.jsx does a basic check before even hitting the API — if the name field is empty it shows an error message immediately without making any network request. 
If the API call fails, it reads the error detail from FastAPI's response and shows it to the user in a red message box. 
JobList.jsx handles the case where the backend is not running at all — instead of crashing it shows a "Cannot reach backend" message in the table area. The polling continues even after an error so the moment the backend comes back online, the table starts working again automatically.
If a job is requested by ID that doesn't exist, the API returns a clean 404 error with a "Job not found" message. 
Configures the Vite development server. The proxy rule forwards all /jobs requests to the backend on port 8000 so the browser never gets CORS errors
