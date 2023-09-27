# Runescape Bot
## Overview
### Synopsis:
  This proposal is for creating a botting program that runs onto of a game and mimics human mouse movements to avoid anti-cheat systems.
  MMOBot would give users a way to automate tasks within an game and complete ingame anti-botting features. The proposed game this bot
  would be built for is for the mmo "Old School Runescape"
### Game Choice:
  #### Runesape:
    - Lacks client side anti-cheat(Easy Anti-Cheat/Battle-Eye)
      - Allows programs to run onto of the game without knowledge of game creators
    - Relatively Simplistic Gameplay
      - Movement is tile based
    - Lots of repetative tasks
      - Leveling involves doing one task multiple times
      - Many skills involve predictible and repetitive movements
    - Limited Controls
      - Controls limited to click-to-move and simple keyboard shortcuts
      - Game is playable through the use of only mouse
<img src = "/Screenshots/ClickBoxExample1.png" width="200" height="200"><img src = "/Screenshots/ClickBoxExample2.png" width="200" height="200"><img src = "/Screenshots/DoubleClickBoxExample.png" width="200" height="200">
### Overall Goals:
  - Capture natural mouse movemements and create a model for the botting program to follow
  - Successfully automate tasks within the game(Agility)
  - Complete Random Event/AntiBotting events
  - Error correction in case of bot leaving training area
  - Bot scheduling for auto login and auto log off
<img src = "/Screenshots/ExampleRoute.png" width = "400" height ="400">

### Possible Technologies:
  #### Front-End:
    - Javascript,CSS,HTML
    - Vuejs(https://vuejs.org/)
  #### Back-End:
    - Electron(https://www.electronjs.org/) - For javascript based desktop app
    - nodeJS(https://nodejs.org/en)
    - nutjs(https://nutjs.dev/) - For desktop automation

## Bot General Ideas  
### Bot Abilities:
  - Following Agility Course
  - Dismissing ingame Random Events/Ignoring
  - Picking up items

### Natural Mouse Movements:
  - Record mouse movements of agility training lap 
  - Mouse movements segemented into parts
  - Create Decision Tree to generate natural mouse movements based on recorded data
  - Program decides on mouse movements by deciding which data point in a segement is more "natural"(closest, and similar   mouse speed"
  - Once all segements are decided a full potential mouse path is created

### Random Events:
  - Added random events to bot to simulate real person playing
  - AFK times
  - Disruptions (person walks in)
  - Tabbing out
  - Loss of concentration
  - Intentional ineffiecency

### Automatic Scheduling(Imitating a real persons daily life):
  - Login/Logout
  - Sleep cycle
  - Work/School
  - Meal Times
  - Break Periods

### Failure Correction:
  - Leaving training area
  - Avoiding bot behaviours(walking in to walls/Clicking on invalid Areas)
  - Fail safes for when situation unrecoverable(Logging out/Teleporting Out)# Capstone
