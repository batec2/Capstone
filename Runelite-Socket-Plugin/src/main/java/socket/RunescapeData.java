package socket;

import net.runelite.api.Client;
import net.runelite.api.Player;
import net.runelite.api.Skill;
import net.runelite.api.coords.LocalPoint;

public class RunescapeData {
    Client client;
    Player player = null;
    private int previousX = 0;
    private int previousY = 0;
    private Integer initialAgilityExp = null;
    private int gainedAgilityExp = 0;
    RunescapeData(Client client){
        this.client = client;
    }

    public void setPlayer() {
        player = client.getLocalPlayer();
    }

    public void addAgilityExp(int exp){
        if(this.initialAgilityExp == null){
            this.initialAgilityExp = exp;
        }
        this.gainedAgilityExp = exp - initialAgilityExp;
    }

    public String getInfo(boolean camera, boolean location, boolean exp){
        if(player==null){
            player = client.getLocalPlayer();
        }
        int agilityExp = client.getSkillExperience(Skill.AGILITY);
//        this.gainedAgilityExp += agilityExp - this.initialAgilityExp;
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
        if(exp){
            info+=",";
            info+= String.format("\"exp\":{\"agility\":%d,\"gainedAgility\":%d}",agilityExp, this.gainedAgilityExp);
        }
        info+="}";

        return info;
    }
}
