import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Responses - AnswerPath",
  description: "RFI response management interface.",
}

export default function ResponsesPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Responses</h2>
        <div className="flex items-center space-x-2">
          <Button variant="default">
            <MessageSquare className="mr-2 h-4 w-4" />
            New Response
          </Button>
        </div>
      </div>
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:bg-accent/50 cursor-pointer transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg">RFI-2024-{i}</CardTitle>
                    <CardDescription>Project Alpha</CardDescription>
                  </div>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      Request for clarification on section {i}.1 of the technical specifications.
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <div className="flex items-center">
                        Due in {i} day{i !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2].map((i) => (
              <Card key={i} className="hover:bg-accent/50 cursor-pointer transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg">RFI-2024-{i + 3}</CardTitle>
                    <CardDescription>Project Beta</CardDescription>
                  </div>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      Request for additional information on material specifications.
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <div className="flex items-center">
                        Awaiting review
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="hover:bg-accent/50 cursor-pointer transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg">RFI-2024-{i + 5}</CardTitle>
                    <CardDescription>Project Gamma</CardDescription>
                  </div>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      Clarification on construction timeline provided.
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <div className="flex items-center">
                        Completed {i} day{i !== 1 ? 's' : ''} ago
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
