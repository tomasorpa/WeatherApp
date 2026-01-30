import React from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircleIcon, MapPin } from "lucide-react";
import { Button } from "./ui/button";

export const CustomAlert = ({ getLocation, title, subtitle, btnText }) => {
  //title
    //Please enable location access to see your local weather.
    //Location Required
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>{subtitle }</p>
        <Button onClick={getLocation} variant={"outline"} className="w-fit">
          <MapPin className="h-4 w-4" />
          {btnText}
        </Button>
      </AlertDescription>
    </Alert>
  );
};
