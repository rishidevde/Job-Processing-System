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


Backend :- 

1) Main :- 
2) Schemas.py :- 
    validates the data a user sends before it reaches the database. When someone submits a new job, it checks that the name is not empty and the duration is between 5 and 30 seconds. If the data is invalid, FastAPI automatically rejects the request and sends back an error

3) Worker.py :- 
    Run parallel to the server. Loop forever within each 2 second it check for pending jobs. If there is then mark it as processing. With time.sleep simulation aftet that mark as completed if not error and error is there then mark it as failed.


4) Database.py :-
  init_db() creates the jobs table,
  insert_job() saves a new job,
  get_all_jobs() fetches job ordered by LIFO,
  get_job_by_id() give single job using its unique ID,
  get_next_pending_job() - worker pick oldest pending job for processing.
  update_job_status() by worker to change a job's status


Frontend

1) api.js
  createJob() sends a POST request to create a new job
  fetchJobs() gets the list of all jobs
  fetchJob() gets a single job by its ID

2) main.jsx :- Entry point of the React app. Mounts the App component into the HTML page

3) App.jsx
    Root component that holds the entire page together. Renders JobForm on the left and JobList on the right, Holds a refreshTick counter that tells JobList to fetch immediately when a new job is submitted

4) JobForm.jsx
   Renders the form with a name input and duration slider handleSubmit() sends the job to the backend when user clicks submit. Shows a green success message or red error message based on the response

5) JobList.jsx
Fetches and displays all jobs in a table
loadJobs() fetches the latest jobs from the backend
Polls automatically every 2 seconds so status updates appear in real time without refreshing the page

6) index.css

Contains all the styling for the entire frontend. Defines colors, fonts, layout, badges, table, form and animations

7) vite.config.js

Configures the Vite development server. The proxy rule forwards all /jobs requests to the backend on port 8000 so the browser never gets CORS errors
