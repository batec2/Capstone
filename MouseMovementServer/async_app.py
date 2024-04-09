"""
MouseMovementServer

This server receives points from a client and returns a list of points based on the WindMouse algorithm.
"""

"""
how to install dependencies via termial:
- pip install python-socketio
- pip install asyncio
- pip install uvicorn
- pip install numpy

how to run via terminal (pointed to app directory):
- uvicorn async_app:app
- python -m uvicorn async_app:app --reload
"""

import socketio
from wind_mouse import wind_mouse
import numpy as np
import json

static_files = {
    "/": "public\index.html",
}

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
app = socketio.ASGIApp(sio, static_files=static_files)


@sio.event
async def connect(sid, environ):
    print(sid, "connected")


@sio.event
async def disconnect(sid):
    print(sid, "disconnected")


@sio.event
async def points(sid, data):

    print(sid, type(data))
    if isinstance(data, str):
        jsonData = json.loads(data)
    else:
        jsonData = data
    start_x = jsonData["start"][0]
    start_y = jsonData["start"][1]
    end_x = jsonData["end"][0]
    end_y = jsonData["end"][1]

    points = []
    wind_mouse(
        start_x,
        start_y,
        end_x,
        end_y,
        G_0=9,
        W_0=3,
        M_0=15,
        D_0=12,
        move_mouse=lambda a, b: points.append([a, b]),
    )
    print(points)
    return points
    # await sio.emit("points_result", {"points": points}, to=sid)
