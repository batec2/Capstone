import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import "./playerInfo.styles.css";

const PlayerInfo = ({
  playerPosition,
  cameraPosition,
  animation,
  isMoving,
}) => {
  return (
    <Card className="w-60 h-[532px]">
      <CardHeader>
        <CardTitle>Player Information</CardTitle>
        <CardDescription>Various information on player state</CardDescription>
      </CardHeader>
      <CardContent>
        <Label className="font-bold text-lg">Player Position</Label>
        <div className="info-line">
          <p className="mr-2">{"X Position:"}</p>
          <p> {playerPosition ? `${playerPosition.x}` : "No Data"}</p>
        </div>
        <div className="info-line">
          <p className="mr-2">{"Y Position:"}</p>
          <p> {playerPosition ? `${playerPosition.y}` : "No Data"}</p>
        </div>
        <div className="info-line">
          <p className="mr-2 font-semibold">{"Moving:"}</p>
          <p> {`${isMoving}`}</p>
        </div>
        <div className="info-line">
          <p className="mr-2 font-semibold">{"Animation:"}</p>
          <p> {animation ? `${animation}` : "No Data"}</p>
        </div>
        <Separator orientation="horizontal"></Separator>
        <Label className="font-bold text-lg">Camera Position</Label>
        <div>
          <div className="info-line">
            <p className="mr-2 font-semibold">{"X Position:"}</p>
            <p className="mr-2 ">
              {cameraPosition ? `${cameraPosition.x}` : "No Data"}
            </p>
          </div>
          <div className="info-line">
            <p className="mr-2 font-semibold">{"Y Position:"}</p>
            <p> {cameraPosition ? `${cameraPosition.y}` : "No Data"}</p>
          </div>
        </div>
        <Separator orientation="horizontal"></Separator>
        <div>
          <div className="info-line">
            <p className="mr-2 font-semibold">{"Yaw:"}</p>
            <p> {cameraPosition ? `${cameraPosition.yaw}` : "No Data"}</p>
          </div>
          <div className="info-line">
            <p className="mr-2 font-semibold">{"Pitch:"}</p>
            <p> {cameraPosition ? `${cameraPosition.pitch}` : "No Data"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerInfo;
