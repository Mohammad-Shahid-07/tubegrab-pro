import { error } from "console";
import { AlertCircle } from "lucide-react";
import { FunctionComponent } from "react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

interface ErrorAlertProps {
  title: string;
  error: string;
}

const ErrorAlert: FunctionComponent<ErrorAlertProps> = ({ title, error }) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
