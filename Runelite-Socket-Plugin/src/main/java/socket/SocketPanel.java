package socket;

import net.runelite.client.ui.ColorScheme;
import net.runelite.client.ui.PluginPanel;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;

public class SocketPanel extends PluginPanel {

    private JPanel actionsContainer;
    private JButton button ;
    private boolean serverRunning = false;

    private JCheckBox cameraCheckBox;
    private JCheckBox playerLocationCheckBox;
    private JCheckBox emitDataCheckBox;

    private JCheckBox expCheckBox;

    void init(){
        setLayout(new BorderLayout());
        setBackground(ColorScheme.DARK_GRAY_COLOR);
        setBorder(new EmptyBorder(10, 10, 10, 10));

        actionsContainer = new JPanel();
        actionsContainer.setBorder(new EmptyBorder(10, 0, 0, 0));
        actionsContainer.setLayout(new GridLayout(0, 1, 0, 10));
        actionsContainer.add(buildSocketPanel());
        add(actionsContainer, BorderLayout.CENTER);
    }

    public boolean isServerRunning(){
        return serverRunning;
    }

    private JPanel buildSocketPanel(){
        JPanel container = new JPanel();
        this.button = new JButton("Start Server");
        this.emitDataCheckBox = new JCheckBox("Emit Data");
        this.cameraCheckBox = new JCheckBox("Camera Data");
        this.playerLocationCheckBox = new JCheckBox("Player Location");
        this.expCheckBox = new JCheckBox("Player Experience");
        container.setBackground(ColorScheme.BRAND_ORANGE);
        container.setLayout(new BoxLayout(container,BoxLayout.Y_AXIS));
        container.setBorder(new EmptyBorder(10, 10, 10, 10));
        container.add(button);
        container.add(emitDataCheckBox);
        container.add(cameraCheckBox);
        container.add(playerLocationCheckBox);
        container.add(expCheckBox);
        return container;
    }

    public void addEventToButton(Runnable runnable){
        this.button.addActionListener(e-> {
            runnable.run();
            serverRunning = !serverRunning;
            button.setText(serverRunning?"Stop Server":"Start Server");
        });
    }

    public boolean getCameraCheckBoxChecked() {
        return cameraCheckBox.isSelected();
    }

    public boolean getPlayerLocationCheckBoxChecked() {
        return playerLocationCheckBox.isSelected();
    }

    public boolean getEmitDataCheckBoxChecked(){
        return emitDataCheckBox.isSelected();
    }

    public boolean getExpCheckBoxChecked(){
        return expCheckBox.isSelected();
    }
}
