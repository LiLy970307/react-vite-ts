import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { Row, Col } from "antd";

// 初始化6个拖拽项（3x2布局）
const initialItems = [
  { id: "1", content: "Item 1" },
  { id: "2", content: "Item 2" },
  { id: "3", content: "Item 3" },
  { id: "4", content: "Item 4" },
  { id: "5", content: "Item 5" },
  { id: "6", content: "Item 6" },
];

const GridDragDemo = () => {
  const [items, setItems] = useState(initialItems);

  // 拖拽结束处理
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newItems = [...items];
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    setItems(newItems);
  };

  // 将数组分成两行（每行3个）
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
        网格拖拽 Demo (3x2布局)
      </h2>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="grid-droppable" direction="horizontal">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {/* 第一行 */}
              <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
                {initialItems.map((item, index) => (
                  <Col span={8} key={item.id}>
                    <Draggable draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            padding: "20px",
                            background: snapshot.isDragging
                              ? "#e6f7ff"
                              : "#fff",
                            border: "1px solid #d9d9d9",
                            borderRadius: "4px",
                            textAlign: "center",
                            boxShadow: snapshot.isDragging
                              ? "0 4px 8px rgba(0,0,0,0.1)"
                              : "none",
                            transition: "all 0.3s",
                            ...provided.draggableProps.style,
                          }}
                        >
                          {item.content}
                          <div style={{ fontSize: "12px", color: "#888" }}>
                            (可拖拽{index})
                          </div>
                        </div>
                      )}
                    </Draggable>
                  </Col>
                ))}
              </Row>

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div style={{ marginTop: "24px", textAlign: "center", color: "#666" }}>
        提示：拖动项目可在两行之间交换位置
      </div>
    </div>
  );
};

export default GridDragDemo;
