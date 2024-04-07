package socket;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.SocketConfig;

import com.google.inject.Provides;
import javax.inject.Inject;
import lombok.extern.slf4j.Slf4j;

import net.runelite.api.Client;

import net.runelite.api.GameState;
import net.runelite.api.Player;
import net.runelite.api.events.GameStateChanged;
import net.runelite.api.events.GameTick;
import net.runelite.client.config.ConfigManager;
import net.runelite.client.eventbus.Subscribe;
import net.runelite.client.plugins.Plugin;
import net.runelite.client.plugins.PluginDescriptor;
import net.runelite.client.ui.ClientToolbar;
import net.runelite.client.ui.NavigationButton;
import net.runelite.client.util.ImageUtil;

import java.awt.image.BufferedImage;

@Slf4j
@PluginDescriptor(
	name = "Socket Panel",
	description = "Enable the Socket panel",
	loadWhenOutdated = true
)
public class SocketPlugin extends Plugin
{
	@Inject
	private Client client;

	@Inject
	private SocketConfig config;

	@Inject
	private ClientToolbar clientToolbar;

	private SocketPanel socketPanel;

	private NavigationButton navButton;

	private SocketIOServer server;

	private boolean serverRunning = false;
	private RunescapeData runescapeData;

	private int PORT = 3030;

	@Override
	protected void startUp() throws Exception
	{
		runescapeData = new RunescapeData(client);
		//Initializes the plugin Panel
		socketPanel = injector.getInstance(SocketPanel.class);
		socketPanel.init();

		//Gets Icon for side toolbar
		//Must be same folder structure as resources folder and vice versa
		final BufferedImage icon = ImageUtil.loadImageResource(getClass(), "socket_icon.png");

		//Creates Navigation Button for side toolbar
		navButton = NavigationButton.builder()
				.tooltip("Socket")
				.icon(icon)
				.priority(10)
				.panel(socketPanel)
				.build();

		//Create Server
		server = initSocketIoServer();
		socketPanel.addEventToButton(this::startStopServer);

		//Side Tool Bar
		clientToolbar.addNavigation(navButton);
	}

	@Override
	protected void shutDown() throws Exception
	{
		log.info("Example stopped!");
	}

	@Subscribe
	public void onGameStateChanged(GameStateChanged gameStateChanged)
	{
		GameState gameState = gameStateChanged.getGameState();
		if(gameState.getState() == GameState.LOGGED_IN.getState()){
			runescapeData.setPlayer();
		}
	}

	/**
	 * Listener for the gameTick event, every 20ms gameTick fires and this event is executed
	 * @param gameTick - gameTick object
	 */
	@Subscribe
	public void onGameTick(GameTick gameTick){
		if(socketPanel.getEmitDataCheckBoxChecked()){
			// emit x,y,yaw,pitch event with camera data every gametick
			server.getBroadcastOperations()
					.sendEvent("data", runescapeData.getInfo(socketPanel.getCameraCheckBoxChecked(), socketPanel.getPlayerLocationCheckBoxChecked()));
		}
	}

	@Provides
	SocketPluginConfig provideConfig(ConfigManager configManager)
	{
		return configManager.getConfig(SocketPluginConfig.class);
	}

	private void startStopServer(){
		if(!socketPanel.isServerRunning()) {
			server.start();
		}else{
			server.stop();
		}
	}

	private SocketIOServer initSocketIoServer(){
		Configuration config = new Configuration();
		config.setHostname("localhost");
		config.setPort(PORT);

		SocketConfig socketConfig = new SocketConfig();
		socketConfig.setReuseAddress(true);

		config.setSocketConfig(socketConfig);

		return new SocketIOServer(config);
	}
}
