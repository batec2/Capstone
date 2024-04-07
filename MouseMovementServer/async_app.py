'''
MouseMovementServer

This server receives points from a client and returns a list of points based on the WindMouse algorithm.
'''

'''
how to install dependencies via termial:
- pip install python-socketio
- pip install asyncio
- pip install uvicorn
- pip install numpy

how to run via terminal (pointed to app directory):
- uvicorn async_app:app
'''

import socketio
from wind_mouse import wind_mouse
import numpy as np

static_files = {
    '/': 'public\index.html',
}

sio = socketio.AsyncServer(async_mode='asgi')
app = socketio.ASGIApp(sio, static_files=static_files)

@sio.event
async def connect(sid, environ):
    print(sid, 'connected')

@sio.event
async def disconnect(sid):
    print(sid, 'disconnected')

@sio.event
async def points(sid, data):
    
    print(sid, data)

    start_x = data['start'][0]
    start_y = data['start'][1]
    end_x = data['end'][0]
    end_y = data['end'][1]


    points = []
    wind_mouse(start_x, start_y, end_x, end_y, G_0=9, W_0=3, M_0=15, D_0=12, move_mouse=lambda a,b: points.append([a,b]))
    print(points)
    
    await sio.emit('points_result', {'points': points}, to=sid)