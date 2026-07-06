"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const workflowSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  states: z.array(
    z.object({ value: z.string().min(1, "State name is required") }),
  ),
  transitions: z.string().min(2, "Transitions mapping required (JSON)"),
});

type WorkflowFormData = z.infer<typeof workflowSchema>;

export function WorkflowBuilder() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkflowFormData>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: "Default Project Workflow",
      states: [{ value: "TODO" }, { value: "IN_PROGRESS" }, { value: "DONE" }],
      transitions:
        '{\n  "TODO": ["IN_PROGRESS"],\n  "IN_PROGRESS": ["TODO", "DONE"],\n  "DONE": ["TODO"]\n}',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "states",
  });

  const onSubmit = (data: WorkflowFormData) => {
    try {
      // Validate JSON
      JSON.parse(data.transitions);
      console.log("Saved workflow:", data);
      toast.success("Workflow successfully configured.");
    } catch {
      toast.error("Invalid JSON format in transitions.");
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Workflow Engine Config</CardTitle>
        <CardDescription>
          Define the valid states and transitions for this workflow using a
          powerful schema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Workflow Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>States</Label>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    {...register(`states.${index}.value` as const)}
                    placeholder="State name (e.g. IN_PROGRESS)"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ value: "" })}
              >
                <Plus className="h-4 w-4 mr-2" /> Add State
              </Button>
            </div>
            {errors.states && (
              <p className="text-sm text-destructive">
                {errors.states.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="transitions">Transitions (JSON format)</Label>
            <textarea
              id="transitions"
              {...register("transitions")}
              className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
            />
            {errors.transitions && (
              <p className="text-sm text-destructive">
                {errors.transitions.message}
              </p>
            )}
          </div>

          <Button type="submit">Save Workflow Config</Button>
        </form>
      </CardContent>
    </Card>
  );
}
