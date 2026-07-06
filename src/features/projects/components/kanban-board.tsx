"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const initialData = {
  tasks: {
    "task-1": {
      id: "task-1",
      content: "Define Domain Architecture",
      priority: "HIGH",
    },
    "task-2": {
      id: "task-2",
      content: "Set up Prisma & Database schemas",
      priority: "HIGH",
    },
    "task-3": {
      id: "task-3",
      content: "Build Decoupled AI Layer",
      priority: "MEDIUM",
    },
    "task-4": {
      id: "task-4",
      content: "Create interactive Gantt chart UI",
      priority: "LOW",
    },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "TODO",
      taskIds: ["task-3", "task-4"],
    },
    "column-2": {
      id: "column-2",
      title: "IN PROGRESS",
      taskIds: ["task-2"],
    },
    "column-3": {
      id: "column-3",
      title: "REVIEW",
      taskIds: [],
    },
    "column-4": {
      id: "column-4",
      title: "DONE",
      taskIds: ["task-1"],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3", "column-4"],
};

export function KanbanBoard() {
  const [data, setData] = useState(initialData);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId as keyof typeof data.columns];
    const finish =
      data.columns[destination.droppableId as keyof typeof data.columns];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      });
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId as keyof typeof data.columns];
          const tasks = column.taskIds.map(
            (taskId) => data.tasks[taskId as keyof typeof data.tasks],
          );

          return (
            <div
              key={column.id}
              className="min-w-[300px] w-[300px] flex flex-col gap-2"
            >
              <div className="flex items-center justify-between font-medium">
                <span>{column.title}</span>
                <Badge variant="secondary">{tasks.length}</Badge>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 rounded-md bg-muted/50 p-2 min-h-[200px] transition-colors ${
                      snapshot.isDraggingOver ? "bg-muted" : ""
                    }`}
                  >
                    {tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-2 rounded-md ${snapshot.isDragging ? "opacity-75" : ""}`}
                          >
                            <Card className="cursor-grab active:cursor-grabbing">
                              <CardContent className="p-3 text-sm flex flex-col gap-2">
                                <div>{task.content}</div>
                                <Badge
                                  variant={
                                    task.priority === "HIGH"
                                      ? "destructive"
                                      : task.priority === "MEDIUM"
                                        ? "default"
                                        : "secondary"
                                  }
                                  className="w-fit text-[10px]"
                                >
                                  {task.priority}
                                </Badge>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
