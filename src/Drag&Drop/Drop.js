import { Grid } from "@material-ui/core";
import { Droppable } from "react-beautiful-dnd";

export const Drop = ({ id, type, ...props }) => {
    return (

            
        <Droppable droppableId={id} type={type} direction="vertical">
            {(provided) => (
                <Grid
                    container
                    spacing={2}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="droppable-area"
                    style={{ display: "flex", flexDirection: "row" }}
                >
                    {/* Render each item inside the droppable area */}
                    {props.children}
                    {provided.placeholder}
                </Grid>
            )}
        </Droppable>
       

    );
};