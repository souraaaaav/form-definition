import { Draggable } from "react-beautiful-dnd";

export const Drag = ({ id, index, ...props }) => {
    return (
        <Draggable
            draggableId={id}
            index={index}
            shouldAnimateDrop={false} // Disable automatic drop animation
        >
            {(provided, snapshot) => {
                const dragStyle = {
                    // Add your custom styles for the dragging appearance here
                    // For example, change the background color while dragging
                    background: snapshot.isDragging ? "#f0f0f0" : "white",
                    ...provided.draggableProps.style,
                };

                return (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={dragStyle}
                    >
                        <div className="drag-handle">Drag</div>
                        {props.children}
                    </div>
                );
            }}
        </Draggable>
    );
};
