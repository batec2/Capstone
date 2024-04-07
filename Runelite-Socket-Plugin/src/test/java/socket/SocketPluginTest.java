package socket;
import net.runelite.client.RuneLite;
import net.runelite.client.externalplugins.ExternalPluginManager;
public class SocketPluginTest {
    public static void main(String[] args) throws Exception
    {
        ExternalPluginManager.loadBuiltin(SocketPlugin.class);
        RuneLite.main(args);
    }
}
