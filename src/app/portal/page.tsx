import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckSquare, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PortalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to your Portal
        </h1>
        <p className="text-muted-foreground mt-2">
          Track your projects, view invoices, and communicate with our team.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              Active Projects
            </CardTitle>
            <CheckSquare className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">
              E-commerce Redesign
            </p>
            <Button variant="outline" className="w-full mt-4" size="sm">
              View Progress
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Invoices</CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pending payment
            </p>
            <Button variant="outline" className="w-full mt-4" size="sm">
              View Invoices
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Messages</CardTitle>
            <MessageSquare className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              Unread messages
            </p>
            <Button variant="outline" className="w-full mt-4" size="sm">
              Open Chat
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
