import React, { useState } from "react";
import { Drag, DragAndDrop, Drop } from "./Index";
import { reorder } from "./helpers.js";
import './style.css';
export const NestedListComponent = () => {
    const [categories, setCategories] = useState([
        {
            id: "q101",
            name: "Category 1",
            items: [
                { id: "abc", name: "First" },
                { id: "def", name: "Second" }
            ]
        },
        {
            id: "wkqx",
            name: "Category 2",
            items: [
                { id: "ghi", name: "Third" },
                { id: "jkl", name: "Fourth" }
            ]
        },
        {
            id: "q102",
            name: "Category 3",
            items: [
                { id: "xyz", name: "First" },
                { id: "yls", name: "Second" }
            ]
        },
    ]);

    const handleDragEnd = (result) => {
        const { type, source, destination } = result;
        if (!destination) return;

        const sourceCategoryId = source.droppableId;
        const destinationCategoryId = destination.droppableId;

        // Reordering items
        if (type === "droppable-item") {
            // If drag and dropping within the same category
            if (sourceCategoryId === destinationCategoryId) {
                const updatedOrder = reorder(
                    categories.find((category) => category.id === sourceCategoryId).items,
                    source.index,
                    destination.index
                );
                const updatedCategories = categories.map((category) =>
                    category.id !== sourceCategoryId
                        ? category
                        : { ...category, items: updatedOrder }
                );

                setCategories(updatedCategories);
            } else {
            }
        }

        // Reordering categories
        if (type === "droppable-category") {
            const updatedCategories = reorder(
                categories,
                source.index,
                destination.index
            );

            setCategories(updatedCategories);
        }
    };

    return (
        <DragAndDrop onDragEnd={handleDragEnd}>
            <Drop id="droppable" type="droppable-category">
                {categories.map((category, categoryIndex) => {
                    return (
                        <Drag
                            className="draggable-category"
                            key={category.id}
                            id={category.id}
                            index={categoryIndex}
                        >
                            <div className="category-container">
                                <h2 className="item">{category.name}</h2>

                                <Drop key={category.id} id={category.id} type="droppable-item">
                                    {category.items.map((item, index) => {
                                        return (
                                            <Drag
                                                className="draggable"
                                                key={item.id}
                                                id={item.id}
                                                index={index}
                                            >
                                                <div className="item">{item.name}</div>
                                            </Drag>
                                        );
                                    })}
                                </Drop>
                            </div>
                        </Drag>
                    );
                })}
            </Drop>
        </DragAndDrop>
    );
};
