package socket;

import net.runelite.api.Client;
import net.runelite.api.Player;
import net.runelite.api.coords.LocalPoint;

public class RunescapeData {
    Client client;
    Player player = null;
    RunescapeData(Client client){
        this.client = client;
    }
    private int previousX = 0;
    private int previousY = 0;


    public void setPlayer() {
        player = client.getLocalPlayer();
    }

    public String getInfo(boolean camera, boolean location){
        if(player==null){
            player = client.getLocalPlayer();
        }

        String info = "{";
        if(camera) {
            int x = client.getCameraX();
            int y = client.getCameraY();
            int yaw = client.getCameraYaw();
            int pitch = client.getCameraPitch();
            info+=String.format("\"camera\":{\"x\":\"%d\",\"y\":\"%d\",\"yaw\":\"%d\",\"pitch\":\"%d\"}", x, y, yaw, pitch);
        }

        if(location){
            info+=",";
            LocalPoint playerLocation = player.getLocalLocation();
            int x = playerLocation.getX();
            int y = playerLocation.getY();
            boolean isMoving = (previousX==x && previousY==y);
            info+= String.format("\"player\":{\"x\":%d,\"y\":%d},",x,y);
            info+= String.format("\"moving\":%b,",!isMoving);
            info+= String.format("\"animation\":%d",player.getAnimation());
            previousX = x;
            previousY = y;
        }
        info+="}";

        return info;
    }
}
