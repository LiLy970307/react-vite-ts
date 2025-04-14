import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DragUpdate,
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
} from "@hello-pangea/dnd";
import { Dropdown, Menu, message, Input, Row, Col } from "antd";
import type { MenuProps } from "antd";

interface Item {
  id: string;
  content: string;
  groupId: string | null;
}

interface Group {
  id: string;
  name: string;
  collapsed: boolean; // 新增折叠状态
}

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { id: "1", content: "Item 1", groupId: null },
    { id: "2", content: "Item 2", groupId: null },
    { id: "3", content: "Item 3", groupId: null },
    { id: "4", content: "Item 4", groupId: null },
    { id: "5", content: "Item 5", groupId: null },
    { id: "6", content: "Item 6", groupId: null },
  ]);

  const [groups, setGroups] = useState<Group[]>([]);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [combnieItemId, setCombineItemId] = useState<string | null>(null);
  const [ableToCombine, setAbleToCombine] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // 工具函数：检查分组是否为空
  const isGroupEmpty = (groupId: string | null, items: Item[]): boolean => {
    return !items.some((item) => item.groupId === groupId);
  };

  // 工具函数：过滤掉空分组
  const filterEmptyGroups = (
    items: Item[],
    groups: Group[],
    newGroupId?: string // 可选的新分组ID，总是保留
  ): Group[] => {
    return groups.filter((group) => {
      // 新分组总是保留
      if (group.id === newGroupId) return true;
      // 其他分组检查是否为空
      return !isGroupEmpty(group.id, items);
    });
  };

  // 工具函数：移动项目到新分组
  const moveItemToGroup = (
    items: Item[],
    itemId: string,
    newGroupId: string | null
  ): Item[] => {
    return items.map((item) =>
      item.id === itemId ? { ...item, groupId: newGroupId } : item
    );
  };

  //  工具函数： 检查分组名称是否已存在
  const isGroupNameExist = (name: string, groups: Group[]): boolean => {
    return groups.some((group) => group.name === name);
  };

  //  工具函数： 生成唯一的分组名称
  const generateUniqueGroupName = (groups: Group[]): string => {
    let baseName = "Group";
    let counter = 1;
    let newName = `${baseName} ${counter}`;

    // 循环直到找到不重复的名称
    while (isGroupNameExist(newName, groups)) {
      counter++;
      newName = `${baseName} ${counter}`;
    }

    return newName;
  };

  // 检查并删除空分组
  const checkAndRemoveEmptyGroups = (
    currentItems: Item[],
    currentGroups: Group[]
  ) => {
    const nonEmptyGroups = currentGroups.filter((group) =>
      currentItems.some((item) => item.groupId === group.id)
    );

    if (nonEmptyGroups.length < currentGroups.length) {
      setGroups(nonEmptyGroups);
    }
  };

  useEffect(() => {
    console.log(ableToCombine);
  }, [ableToCombine]);

  // 处理拖拽更新
  const onDragUpdate = (update: DragUpdate) => {
    console.log(update);
    const { combine } = update;
    if (combine) {
      const timers = setTimeout(() => {
        setAbleToCombine(true);
      }, 800);
      setTimer(timers);
    } else {
      setAbleToCombine(false);
      clearTimeout(timer!);
    }
    // setCombineItemId(combine?.draggableId || null);
    // if (!destination) return;
  };

  // 创建新分组
  const createNewGroup = (itemId: string) => {
    const newGroupId = `group-${Date.now()}`;
    const newGroupName = generateUniqueGroupName(groups); // 使用新函数生成唯一名称

    // 更新项目列表
    const updatedItems = moveItemToGroup(items, itemId, newGroupId);

    // 更新分组列表（添加新分组并过滤空分组）
    const updatedGroups = filterEmptyGroups(
      updatedItems,
      [...groups, { id: newGroupId, name: newGroupName, collapsed: false }],
      newGroupId
    );

    setItems(updatedItems);
    setGroups(updatedGroups);
    message.success(`已创建新分组 ${newGroupName}`);
    setAbleToCombine(false);
  };

  // 添加到现有分组
  const addToExistingGroup = (itemId: string, groupId: string) => {
    const groupName = groups.find((g) => g.id === groupId)?.name || "";

    // 更新项目列表
    const updatedItems = moveItemToGroup(items, itemId, groupId);

    // 更新分组列表（过滤空分组）
    const updatedGroups = filterEmptyGroups(
      updatedItems,
      groups,
      groupId // 确保目标分组即使为空也会保留
    );

    setItems(updatedItems);
    setGroups(updatedGroups);
    message.success(`已添加到分组 ${groupName}`);
  };

  // 从分组中移除
  const removeFromGroup = (itemId: string) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, groupId: null } : item
    );

    setItems(updatedItems);
    checkAndRemoveEmptyGroups(updatedItems, groups);
    message.success("已从分组中移除");
  };

  // 开始编辑分组名称
  const startEditingGroup = (groupId: string, currentName: string) => {
    setEditingGroupId(groupId);
    setNewGroupName(currentName);
  };

  // 保存分组名称
  const saveGroupName = (groupId: string) => {
    if (newGroupName.trim() === "") {
      message.warning("分组名称不能为空");
      return;
    }

    setGroups(
      groups.map((group) =>
        group.id === groupId ? { ...group, name: newGroupName } : group
      )
    );
    setEditingGroupId(null);
    message.success("分组名称已更新");
  };

  // 切换分组折叠状态
  const toggleGroupCollapse = (groupId: string) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId ? { ...group, collapsed: !group.collapsed } : group
      )
    );
  };

  // 处理拖拽结束
  const onDragEnd = (result: DropResult) => {
    const { source, destination, combine, draggableId } = result;
    console.log(result);

    if (combine && !ableToCombine) return;

    // 1. 处理合并操作（拖拽到另一项上）
    if (combine) {
      const draggedItemId = draggableId; // 被拖拽的项（A项）
      const targetItemId = combine.draggableId; // 目标项（B项）

      // 获取两个项目当前的分组ID
      const draggedItem = items.find((item) => item.id === draggedItemId);
      const targetItem = items.find((item) => item.id === targetItemId);

      if (!draggedItem || !targetItem) return;

      // 创建新分组
      const newGroupId = `group-${Date.now()}`;
      const newGroupName = generateUniqueGroupName(groups);

      // 更新项目：将两个项目移到新分组
      const updatedItems = items.map((item) => {
        if (item.id === draggedItemId || item.id === targetItemId) {
          return { ...item, groupId: newGroupId };
        }
        return item;
      });

      // 更新分组列表（添加新分组并过滤空的原分组）
      const updatedGroups = [
        ...groups.filter(
          (group) =>
            !isGroupEmpty(group.id, updatedItems) ||
            group.id === draggedItem.groupId ||
            group.id === targetItem.groupId
        ),
        { id: newGroupId, name: newGroupName, collapsed: false },
      ];

      setItems(updatedItems);
      setGroups(updatedGroups);
      message.success(`已创建新分组 "${newGroupName}" 并添加选中项`);
      clearTimeout(timer!);
      setAbleToCombine(false);
      return;
    }

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    const sourceGroupId =
      source.droppableId === "ungrouped" ? null : source.droppableId;
    const destGroupId =
      destination.droppableId === "ungrouped" ? null : destination.droppableId;

    // 创建新数组以避免直接修改状态
    const newItems = [...items];

    // 找出被拖动的项目
    const draggedItemIndex = newItems.findIndex(
      (item) => item.id === result.draggableId && item.groupId === sourceGroupId
    );

    if (draggedItemIndex === -1) return;

    const [draggedItem] = newItems.splice(draggedItemIndex, 1);

    // 更新项目的groupId
    draggedItem.groupId = destGroupId;

    // 找到目标位置插入
    const destItems = newItems.filter((item) => item.groupId === destGroupId);
    destItems.splice(destination.index, 0, draggedItem);

    // 重建完整的items数组
    const updatedItems = [
      ...newItems.filter((item) => item.groupId !== destGroupId),
      ...destItems,
    ];

    setItems(updatedItems);
    checkAndRemoveEmptyGroups(updatedItems, groups);
  };

  // 获取分组内的项目
  const getGroupItems = (groupId: string | null) => {
    console.log(items.filter((item) => item.groupId === groupId));

    return items.filter((item) => item.groupId === groupId);
  };

  // 为项目创建右键菜单
  const getItemMenu = (itemId: string): MenuProps => {
    const currentGroupId = items.find((item) => item.id === itemId)?.groupId;

    return {
      items: [
        {
          key: "create-group",
          label: "创建新分组",
          onClick: () => createNewGroup(itemId),
        },
        {
          key: "add-to-group",
          label: "添加到分组",
          children: groups
            .filter((group) => group.id !== currentGroupId)
            .map((group) => ({
              key: `add-to-${group.id}`,
              label: group.name,
              onClick: () => addToExistingGroup(itemId, group.id),
            })),
          disabled:
            groups.filter((group) => group.id !== currentGroupId).length === 0,
        },
        {
          key: "remove-from-group",
          label: "从分组中移除",
          danger: true,
          disabled: !currentGroupId,
          onClick: () => removeFromGroup(itemId),
        },
      ],
    };
  };

  // 为分组标题创建右键菜单
  const getGroupMenu = (groupId: string): MenuProps => ({
    items: [
      {
        key: "rename-group",
        label: "重命名分组",
        onClick: () => {
          const group = groups.find((g) => g.id === groupId);
          if (group) {
            startEditingGroup(groupId, group.name);
          }
        },
      },
      {
        key: "toggle-collapse",
        label: groups.find((g) => g.id === groupId)?.collapsed
          ? "展开分组"
          : "折叠分组",
        onClick: () => toggleGroupCollapse(groupId),
      },
    ],
  });

  return (
    <div style={{ padding: "20px", minHeight: "100vh" }}>
      <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#e3f2fd",
          }}
        >
          {/* 未分组的项目 */}
          {getGroupItems(null).length > 0 && (
            <Droppable droppableId="ungrouped" isCombineEnabled={true}>
              {(provided: DroppableProvided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    padding: "15px",
                    borderRadius: "8px",
                    minWidth: "250px",
                  }}
                >
                  {getGroupItems(null).map((item, index) => (
                    <Dropdown
                      key={item.id}
                      menu={getItemMenu(item.id)}
                      trigger={["contextMenu"]}
                    >
                      <div>
                        <Draggable draggableId={item.id} index={index}>
                          {(
                            provided: DraggableProvided,
                            snapshot: DraggableStateSnapshot
                          ) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              //   className={
                              //     snapshot.combineWith ? "combine-highlight" : ""
                              //   }
                              style={{
                                padding: "12px",
                                margin: "8px 0",
                                backgroundColor:
                                  snapshot.combineTargetFor && ableToCombine
                                    ? "#bbdefb"
                                    : "transparent",
                                transition: snapshot.combineTargetFor
                                  ? "background-color 2s ease"
                                  : "none", // 仅在激活时应用
                                // 强制重绘
                                transform: "translateZ(0)",
                                borderRadius: "4px",
                                ...provided.draggableProps.style,
                              }}
                            >
                              <div
                                style={{
                                  padding: "12px",
                                  background: "white",
                                  borderRadius: "4px",
                                  border: "1px solid #ddd",
                                  color: "#000",
                                }}
                              >
                                {item.content}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      </div>
                    </Dropdown>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}

          {/* 已分组的项目 */}
          <Droppable droppableId="grouped">
            {(provided: DroppableProvided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ padding: "15px", minWidth: "250px" }}
              >
                {groups.map((group) => (
                  <div
                    key={group.id}
                    style={{
                      marginBottom: "16px",
                      padding: 24,
                      background: "#fff",
                      // display: "flex",
                      // gap: 10,
                      // flexWrap: "wrap",
                    }}
                  >
                    {/* 分组内的可拖动项 */}
                    {getGroupItems(group.id).map((item, index) => (
                      <Dropdown
                        key={item.id}
                        menu={getItemMenu(item.id)}
                        trigger={["contextMenu"]}
                      >
                        <Draggable draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                padding: "12px",
                                background: snapshot.isDragging
                                  ? "#bbdefb"
                                  : "white",
                                border: "1px solid #90caf9",
                                ...provided.draggableProps.style,
                              }}
                            >
                              {item.content}
                            </div>
                          )}
                        </Draggable>
                      </Dropdown>
                    ))}
                  </div>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};

export default App;
