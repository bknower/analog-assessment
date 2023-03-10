# analog-assessment

## Setup

`pip install -r requirements.txt `

## How to run back end

`cd flask`

`flask run`

Make sure you run it from inside the flask directory, so you can access the
existing sqlite database which already has the necessary tables set up. If
there are any issues with the database, you can try to reinitialize it:

`python3 init_db.py`

Running [here](https://localhost:5000)

## How to run front end

`npm start --prefix front-end`

Running [here](https://localhost:3000)
