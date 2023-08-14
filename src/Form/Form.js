import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Add, ExpandLess, ExpandMore } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Drag, DragAndDrop, Drop } from "../Drag&Drop/Index";
import { dataPointList } from "./dataPointList";

import "../Drag&Drop/style.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Form = () => {
  const [formData, setFormData] = useState({
    code_name: "1",
    name: "sds",
    sections: [],
  });

  // data point list
  const [dbDataPointList, setDbDataPointList] = useState(dataPointList);
  const [insertedDataPoint, setInsertedDataPoint] = useState({});
  const [sectionWiseDataPoint, setSectionWiseDataPoint] = useState({});

  // Field
  const [addFieldModal, setAddFieldModal] = useState(false);

  // Collapse
  const initialCollapseStates = {
    // 'section.0': false,
    // 'section.0.datapoint.0': false,
    // 'section.0.datapoint.1': false,
  };

  const [collapseStates, setCollapseStates] = useState(initialCollapseStates);

  // Sections
  const [sections, setSections] = useState(formData.sections);
  const [openSectionModal, setOpenSectionModal] = useState(false);
  const initialSectionState = {
    code_name: "",
    name: "",
    row_position: "",
    column_position: "",
    dp_list: [],
  };
  const [newSectionData, setNewSectionData] = useState(initialSectionState);

  // Datapoint

  const [dataPointPath, setDataPointPath] = useState("");
  const [openDatapointModal, setOpenDatapointModal] = useState(false);
  const initialDataPointState = {
    name: "",
    label: "",
    editable: "",
    row_position: "",
    column_position: "",
    position_relative_to_parent: "",
    sub_data_point_list: [],
  };
  const [newDatapointData, setNewDatapointData] = useState(
    initialDataPointState
  );

  // Sub DataPoint
  const [sectionDpWiseSubDp, setSectionDpWiseSubDp] = useState({});
  const [subDataPointPath, setSubDataPointPath] = useState("");
  const [openSubDatapointModal, setOpenSubDatapointModal] = useState(false);
  const initialSubDataPointState = {
    name: "",
    label: "",
    editable: "",
    row_position: "",
    column_position: "",
    position_relative_to_parent: "",
    sub_data_point_list: [],
  };
  const [newSubDatapointData, setNewSubDatapointData] = useState(
    initialSubDataPointState
  );

  function generateUniqueId() {
    return uuidv4();
  }

  const handleAddFieldModal = () => {
    setAddFieldModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const AddFieldComponent = (
    <Modal
      open={addFieldModal}
      onClose={() => setAddFieldModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <form onSubmit={handleSubmit} style={{ margin: "0 auto" }}>
          <TextField
            label="code_name"
            value={formData.code_name}
            inputProps={{ wti: "code_name" }}
            onChange={(e) =>
              handleChange(e.target.getAttribute("wti"), e.target.value)
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="name"
            value={formData.name}
            inputProps={{ wti: "name" }}
            onChange={(e) =>
              handleChange(e.target.getAttribute("wti"), e.target.value)
            }
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );

  //section

  const handleSectionOpenModal = () => {
    setOpenSectionModal(true);
  };

  const handleSectionCloseModal = () => {
    setOpenSectionModal(false);
    setNewSectionData(initialSectionState);
  };

  const addSection = () => {
    const rowPosition = sections.length + 1; // Calculate the row position

    const newSection = {
      id: generateUniqueId(),
      code_name: newSectionData.code_name,
      name: newSectionData.name,
      row_position: rowPosition,
      column_position: 1,
      dp_list: [],
    };

    setSections((prevSections) => [...prevSections, newSection]);
    setFormData((prevData) => ({
      ...prevData,
      sections: [...prevData.sections, newSection],
    }));
    setSectionWiseDataPoint((prevData) => ({
      ...prevData,
      [newSectionData.code_name]: dbDataPointList,
    }));
    setNewSectionData(initialSectionState);
    handleSectionCloseModal();
  };

  const AddSectionComponent = (
    <Modal open={openSectionModal} onClose={handleSectionCloseModal}>
      <Box sx={style}>
        <h1>Add Section</h1>
        <TextField
          label="Code Name"
          value={newSectionData.code_name}
          onChange={(e) =>
            setNewSectionData({ ...newSectionData, code_name: e.target.value })
          }
          fullWidth
        />
        <TextField
          label="Name"
          value={newSectionData.name}
          onChange={(e) =>
            setNewSectionData({ ...newSectionData, name: e.target.value })
          }
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={addSection}
          style={{ marginTop: "16px" }}
        >
          Add
        </Button>
        <Button
          variant="contained"
          color="default"
          onClick={handleSectionCloseModal}
          style={{ marginTop: "16px", marginLeft: "8px" }}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );

  //Datapoint

  const handleDatapointOpenModal = (currentPath) => {
    setOpenDatapointModal(true);
    setDataPointPath(currentPath);
  };

  const handleDatapointCloseModal = () => {
    setOpenDatapointModal(false);
    setNewDatapointData(initialDataPointState);
    setDataPointPath("");
  };

  const addDatapoint = (path) => {
    const updatedFormData = { ...formData };
    let currentLevel = updatedFormData;
    let currentPath = [...path];
    let counter = 0;
    let sectionCodeName = "";
    const keyList = [];

    while (currentPath.length > 1) {
      const key = currentPath.shift();
      currentLevel = currentLevel[key];
      if (counter == 1) {
        keyList.push(currentLevel["code_name"]);

        sectionCodeName = currentLevel.code_name;
      }
      if (counter >= 3 && counter % 2 !== 0) {
        keyList.push(currentLevel["name"]);
      }
      counter++;
    }
    keyList.push(newDatapointData.name);

    const newDataPoint = {
      id: generateUniqueId(),
      name: newDatapointData.name,
      label: newDatapointData.label,
      row_position: currentLevel.dp_list.length + 1,
      column_position: 1,
      editable: false,
      position_relative_to_parent: "null",
      sub_data_point_list: [],
    };

    currentLevel.dp_list.push(newDataPoint);

    const updatedSectionDpWiseSubDp = { ...sectionDpWiseSubDp };
    buildNestedObject(keyList, updatedSectionDpWiseSubDp);
    setSectionDpWiseSubDp(updatedSectionDpWiseSubDp);

    setFormData(updatedFormData);
    setInsertedDataPoint((prevData) => {
      if (prevData.hasOwnProperty(sectionCodeName)) {
        if (prevData[sectionCodeName].hasOwnProperty(newDatapointData.name)) {
          return {
            ...prevData,
            [sectionCodeName]: {
              ...prevData[sectionCodeName],
              [newDatapointData.name]: newDatapointData.name,
            },
          };
        } else {
          return {
            ...prevData,
            [sectionCodeName]: {
              ...prevData[sectionCodeName],
              [newDatapointData.name]: dataPointList[newDatapointData.name],
            },
          };
        }
      } else {
        return {
          ...prevData,
          [sectionCodeName]: {
            [newDatapointData.name]: dataPointList[newDatapointData.name],
          },
        };
      }
    });

    setNewDatapointData(initialDataPointState);
    setSectionWiseDataPoint((prevData) => {
      const updatedSectionData = { ...prevData[sectionCodeName] };
      delete updatedSectionData[newDatapointData.name];

      return {
        ...prevData,
        [sectionCodeName]: updatedSectionData,
      };
    });
    handleDatapointCloseModal();
  };

  const handleCustomDropDownInput = (e, value) => {
    let selectedValue = "";
    if (value !== null) {
      if (typeof value === "object" && value.hasOwnProperty("inputValue")) {
        selectedValue = value.inputValue;
      } else {
        selectedValue = value;
      }
    }

    setNewDatapointData({ ...newDatapointData, name: selectedValue });
  };

  const getDataPointByPath = (givenPath) => {
    const updatedFormData = { ...formData };
    let currentLevel = updatedFormData;
    let currentPath = [...givenPath];

    if (givenPath.length < 1) {
      return;
    }

    let counter = 0;
    let sectionCodeName = "";
    while (currentPath.length > 1) {
      const key = currentPath.shift();
      currentLevel = currentLevel[key];
      if (counter == 1) {
        sectionCodeName = currentLevel.code_name;
      }
      counter++;
    }

    return Object.keys(sectionWiseDataPoint[sectionCodeName]);
  };
  const AddDatapointComponent = (
    <Modal open={openDatapointModal} onClose={handleDatapointCloseModal}>
      <Box sx={style}>
        <h1>Add Datapoint</h1>
        <Autocomplete
          freeSolo
          autoSelect
          options={getDataPointByPath([...dataPointPath])}
          renderInput={(params) => (
            <TextField {...params} label="Name" variant="outlined" />
          )}
          value={newDatapointData.name}
          onChange={handleCustomDropDownInput}
        />
        <TextField
          label="Label"
          value={newDatapointData.label}
          onChange={(e) =>
            setNewDatapointData({ ...newDatapointData, label: e.target.value })
          }
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => addDatapoint([...dataPointPath])}
          style={{ marginTop: "16px" }}
        >
          Add
        </Button>
        <Button
          variant="contained"
          color="default"
          onClick={handleDatapointCloseModal}
          style={{ marginTop: "16px", marginLeft: "8px" }}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );

  //SubDp

  const handleSubDatapointOpenModal = (currentPath) => {
    setOpenSubDatapointModal(true);
    setSubDataPointPath(currentPath);
  };

  const handleSubDatapointCloseModal = () => {
    setOpenSubDatapointModal(false);
    setNewSubDatapointData(initialSubDataPointState);
    setSubDataPointPath("");
  };

  const handleCustomDropDownInputForSubDP = (e, value) => {
    let selectedValue = "";
    if (value !== null) {
      if (typeof value === "object" && value.hasOwnProperty("inputValue")) {
        selectedValue = value.inputValue;
      } else {
        selectedValue = value;
      }
    }

    setNewSubDatapointData({ ...newSubDatapointData, name: selectedValue });
  };

  const buildNestedObject = (keyList, currentState) => {
    let currentLevel = currentState;
    for (const key of keyList) {
      if (!currentLevel.hasOwnProperty(key)) {
        currentLevel[key] = {};
      }
      currentLevel = currentLevel[key];
    }
    return currentLevel;
  };

  const addSubDatapoint = (path) => {
    const updatedFormData = { ...formData };
    let currentLevel = updatedFormData;
    let currentPath = [...path];
    let counter = 0;
    const keyList = [];
    while (currentPath.length > 1) {
      const key = currentPath.shift();
      currentLevel = currentLevel[key];
      if (counter === 1) {
        keyList.push(currentLevel["code_name"]);
      }
      if (counter >= 3 && counter % 2 !== 0) {
        keyList.push(currentLevel["name"]);
      }
      counter++;
    }
    keyList.push(newSubDatapointData.name);

    const newDataPoint = {
      id: generateUniqueId(),
      name: newSubDatapointData.name,
      label: newSubDatapointData.label,
      row_position: currentLevel.sub_data_point_list.length + 1,
      column_position: 1,
      editable: false,
      position_relative_to_parent: "null",
      sub_data_point_list: [],
    };

    currentLevel.sub_data_point_list.push(newDataPoint);

    const updatedSectionDpWiseSubDp = { ...sectionDpWiseSubDp };
    buildNestedObject(keyList, updatedSectionDpWiseSubDp);
    setSectionDpWiseSubDp(updatedSectionDpWiseSubDp);

    setFormData(updatedFormData);
    setNewSubDatapointData(initialDataPointState);
    handleSubDatapointCloseModal();
  };

  const getCurrentPathSubDP = (givenPath) => {
    const updatedFormData = { ...formData };
    let currentLevel = updatedFormData;
    let currentPath = [...givenPath];
    let tempInsertedDataPoint = { ...insertedDataPoint };
    let tempSectionDpWiseSubDp = { ...sectionDpWiseSubDp };
    let subDpDict = {};
    let counter = 0;
    while (currentPath.length > 1) {
      const key = currentPath.shift();
      currentLevel = currentLevel[key];
      //going through section
      if (counter === 1) {
        tempInsertedDataPoint =
          tempInsertedDataPoint[currentLevel["code_name"]];
        tempSectionDpWiseSubDp =
          tempSectionDpWiseSubDp[currentLevel["code_name"]];
      }
      if (counter >= 3 && counter % 2 !== 0) {
        //going through sub_data_point_list
        if (counter >= 5) {
          subDpDict =
            tempInsertedDataPoint.sub_data_point_list[currentLevel["name"]];
          tempInsertedDataPoint =
            tempInsertedDataPoint.sub_data_point_list[currentLevel["name"]];
          tempSectionDpWiseSubDp = tempSectionDpWiseSubDp[currentLevel["name"]];
        } else {
          //going through dp_list
          subDpDict = tempInsertedDataPoint[currentLevel["name"]];
          tempInsertedDataPoint = tempInsertedDataPoint[currentLevel["name"]];
          tempSectionDpWiseSubDp = tempSectionDpWiseSubDp[currentLevel["name"]];
        }
      }
      counter++;
    }
    const result = {};
    if (
      Object.keys(tempSectionDpWiseSubDp).length >= 1 &&
      Object.keys(subDpDict).length >= 1
    ) {
      for (const key in subDpDict.sub_data_point_list) {
        if (!tempSectionDpWiseSubDp.hasOwnProperty(key)) {
          result[key] = subDpDict.sub_data_point_list[key];
        }
      }
      return result;
    }
    return subDpDict.sub_data_point_list;
  };
  const AddSubDatapointComponent = () => {
    return (
      <Modal
        open={openSubDatapointModal}
        onClose={handleSubDatapointCloseModal}
      >
        <Box sx={style}>
          <h1>Add Datapoint</h1>
          <Autocomplete
            // freeSolo
            // autoSelect
            options={
              getCurrentPathSubDP(subDataPointPath)
                ? Object.keys(getCurrentPathSubDP(subDataPointPath))
                : null
            }
            renderInput={(params) => (
              <TextField {...params} label="Name" variant="outlined" />
            )}
            value={newSubDatapointData.name}
            onChange={handleCustomDropDownInputForSubDP}
          />
          <TextField
            label="Label"
            value={newSubDatapointData.label}
            onChange={(e) =>
              setNewSubDatapointData({
                ...newSubDatapointData,
                label: e.target.value,
              })
            }
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => addSubDatapoint([...subDataPointPath])}
            style={{ marginTop: "16px" }}
          >
            Add
          </Button>
          <Button
            variant="contained"
            color="default"
            onClick={handleSubDatapointCloseModal}
            style={{ marginTop: "16px", marginLeft: "8px" }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    );
  };

  // handle text update
  const handleTextUpdate = (path, key, value) => {
    const updatedFormData = { ...formData };
    let currentLevel = updatedFormData;
    let currentPath = [...path];
    while (currentPath.length >= 1) {
      const key = currentPath.shift();
      currentLevel = currentLevel[key];
    }

    currentLevel[key] = value;
    setFormData(updatedFormData);
  };

  //Form

  const checkPathHaveSubDPInForm = (givenPath) => {
    const updatedFormData = { ...formData };
    let currentLevel = updatedFormData;
    let currentPath = [...givenPath];
    let tempInsertedDataPoint = { ...insertedDataPoint };

    let tempSectionDpWiseSubDp = { ...sectionDpWiseSubDp };

    let subDpDict = {};
    let counter = 0;
    while (currentPath.length >= 1) {
      const key = currentPath.shift();
      currentLevel = currentLevel[key];
      if (counter === 1) {
        tempInsertedDataPoint =
          tempInsertedDataPoint[currentLevel["code_name"]];

        tempSectionDpWiseSubDp =
          tempSectionDpWiseSubDp[currentLevel["code_name"]];
      }
      if (counter >= 3 && counter % 2 !== 0) {
        if (counter >= 5) {
          subDpDict =
            tempInsertedDataPoint.sub_data_point_list[currentLevel["name"]];
          tempInsertedDataPoint =
            tempInsertedDataPoint.sub_data_point_list[currentLevel["name"]];
          tempSectionDpWiseSubDp = tempSectionDpWiseSubDp[currentLevel["name"]];
        } else {
          subDpDict = tempInsertedDataPoint[currentLevel["name"]];
          tempInsertedDataPoint = tempInsertedDataPoint[currentLevel["name"]];
          tempSectionDpWiseSubDp = tempSectionDpWiseSubDp[currentLevel["name"]];
        }
      }

      counter++;
    }
    const result = {};

    if (!subDpDict) return false;
    if (
      Object.keys(tempSectionDpWiseSubDp).length >= 1 &&
      Object.keys(subDpDict).length >= 1
    ) {
      for (const key in subDpDict.sub_data_point_list) {
        if (!tempSectionDpWiseSubDp.hasOwnProperty(key)) {
          result[key] = subDpDict.sub_data_point_list[key];
        }
      }
      return Object.keys(result).length !== 0;
    }
    return Object.keys(subDpDict.sub_data_point_list).length !== 0;
  };

  const DynamicForm = ({ data }) => {
    const useStyles = makeStyles((theme) => ({
      sectionContainer: {
        marginBottom: theme.spacing(3),
        paddingLeft: theme.spacing(2),
        position: "relative",
        "&::before": {
          content: "''",
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 2,
          backgroundColor: theme.palette.primary.main,
          visibility: "hidden",
          transition: "visibility 0.3s ease-in-out",
        },
        "&.collapsed::before": {
          visibility: "visible",
        },
      },
      nestedSectionContainer: {
        marginLeft: theme.spacing(2),
        borderLeft: `2px solid ${theme.palette.secondary.main}`,
      },
      collapseIcon: {
        marginRight: theme.spacing(1),
      },
    }));

    function renderForm(data, collapseStates, setCollapseStates, path = []) {
      const classes = useStyles();
      if (typeof data !== "object" || data === null) {
        return null;
      }

      return Object.entries(data).map(([key, value], index) => {
        const currentPath = [...path, key];
        const isSectionCollapsed = collapseStates[currentPath.join(".")];

        const handleToggleCollapse = () => {
          setCollapseStates((prevState) => ({
            ...prevState,
            [currentPath.join(".")]: !isSectionCollapsed,
          }));
        };

        if (Array.isArray(value)) {
          // Handle nested sections
          return (
            <div key={key} className={classes.sectionContainer}>
              <Typography variant="h6" gutterBottom>
                <IconButton
                  className={classes.collapseIcon}
                  onClick={handleToggleCollapse}
                  size="small"
                >
                  {isSectionCollapsed ? <ExpandMore /> : <ExpandLess />}
                </IconButton>
                {key}
              </Typography>

              {currentPath.length === 1 && currentPath[0] === "sections" && (
                <Button
                  className={classes.addButton}
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  onClick={() => handleSectionOpenModal()}
                >
                  Add Section
                </Button>
              )}

              {currentPath.length === 3 && currentPath[2] === "dp_list" && (
                <Button
                  className={classes.addButton}
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  onClick={() => handleDatapointOpenModal(currentPath)}
                >
                  Add Datapoint
                </Button>
              )}

              {currentPath.length > 3 &&
                currentPath[currentPath.length - 1] === "sub_data_point_list" &&
                checkPathHaveSubDPInForm(currentPath) && (
                  <Button
                    className={classes.addButton}
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => handleSubDatapointOpenModal(currentPath)}
                  >
                    Add Sub Datapoint
                  </Button>
                )}
              {!isSectionCollapsed && (
                <Grid container spacing={2}>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Drop
                      id={currentPath.join(",") + "1"}
                      type={currentPath.join(",")}
                    >
                      {value.map((section, index) => {
                        if (index % 2 === 0) {
                          return (
                            <Grid item xs={12} md={12} key={`${key}-${index}`}>
                              <Drag
                                className="draggable"
                                key={section.id}
                                id={currentPath.join(",") + `,${index}`}
                                index={index}
                              >
                                <div className={classes.nestedSectionContainer}>
                                  {renderForm(
                                    section,
                                    collapseStates,
                                    setCollapseStates,
                                    [...currentPath, index]
                                  )}
                                </div>
                              </Drag>
                            </Grid>
                          );
                        }
                        return null; // Return null for odd indices
                      })}
                    </Drop>
                    <Drop
                      id={currentPath.join(",") + "2"}
                      type={currentPath.join(",")}
                    >
                      {value.map((section, index) => {
                        if (index % 2 !== 0) {
                          return (
                            <Grid item xs={12} md={12} key={`${key}-${index}`}>
                              <Drag
                                className="draggable"
                                key={section.id}
                                id={currentPath.join(",") + `,${index}`}
                                index={index}
                              >
                                <div className={classes.nestedSectionContainer}>
                                  {renderForm(
                                    section,
                                    collapseStates,
                                    setCollapseStates,
                                    [...currentPath, index]
                                  )}
                                </div>
                              </Drag>
                            </Grid>
                          );
                        }
                        return null; // Return null for even indices
                      })}
                    </Drop>
                  </div>
                </Grid>
              )}
            </div>
          );
        } else if (typeof value === "object") {
          // Handle nested datapoints recursively
          return (
            <div key={key} className={classes.sectionContainer} test={key}>
              {!isSectionCollapsed && (
                <Grid container spacing={2}>
                  {renderForm(
                    value,
                    collapseStates,
                    setCollapseStates,
                    currentPath
                  )}
                </Grid>
              )}
            </div>
          );
        } else {
          // Generate form element based on the key-value pair
          return (
            <>
              {key !== "id" ? (
                <Grid item xs={12} key={key}>
                  <TextField
                    label={key}
                    name={key}
                    defaultValue={value === null ? "null" : value}
                    fullWidth
                    onChange={(e) =>
                      handleTextUpdate(path, key, e.target.value)
                    }
                  />
                </Grid>
              ) : null}
            </>
          );
        }
      });
    }
    console.log(formData)
    const handleDragEnd = (result) => {
      if (!result.destination) return;

      const fromPath = result.source.droppableId.split(",");
      const fromIndex = result.source.index;
      const toPath = result.destination.droppableId.split(",");
      const toIndex = result.destination.index;
      console.log(result);
      // return
      if (fromPath.join(",") !== toPath.join(",")) return;
      console.log(result);

      const updatedFormData = { ...formData };
      console.log(updatedFormData);

      let currentLevel = updatedFormData;
      for (const key of fromPath) {
        currentLevel = currentLevel[key];
      }
      const [removedItem] = currentLevel.splice(fromIndex, 1);
      currentLevel.splice(toIndex, 0, removedItem);
      const startIndex = Math.min(fromIndex, toIndex);
      const endIndex = Math.max(fromIndex, toIndex);
      for (let i = startIndex; i <= endIndex; i++) {
        currentLevel[i].row_position = i + 1;
      }

      console.log(updatedFormData);

      setFormData(updatedFormData);
    };
    return (
      <Container>
        <form>
          <DragAndDrop onDragEnd={handleDragEnd}>
            {renderForm(data, collapseStates, setCollapseStates)}
          </DragAndDrop>
        </form>
      </Container>
    );
  };
  return (
    <div>
      <button onClick={handleAddFieldModal}>Add Field</button>
      {AddFieldComponent}
      {AddSectionComponent}
      {AddDatapointComponent}
      {AddSubDatapointComponent()}
      <div>
        <DynamicForm data={formData} />
      </div>
    </div>
  );
};

export default Form;
