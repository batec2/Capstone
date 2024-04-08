import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Label } from "@/components/ui/label.jsx";
import "./expCounter.styles.css";

const ExpCounter = ({ exp }) => {
  let agility;
  let gainedAgility;
  if (exp) {
    agility = exp.agility;
    gainedAgility = exp.gainedAgility;
  }
  return (
    <Card className="max-w-[300px] m-1">
      <CardHeader>
        <CardTitle>Experience</CardTitle>
        <CardDescription>Exprience Info</CardDescription>
      </CardHeader>
      <CardContent>
        <Label className="font-bold text-lg">Player Position</Label>
        <div className="info-line">
          <p className="mr-2">{"Gained Agility Exp:"}</p>
          <p> {exp ? `${gainedAgility}` : ""}</p>
        </div>
        <div className="info-line">
          <p className="mr-2">{"Current Agility Exp:"}</p>
          <p> {exp ? `${agility}` : ""}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpCounter;
