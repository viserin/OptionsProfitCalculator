import React from "react";
import ChainData from "../components/ChainData";
import Grid from "@material-ui/core/Grid";
import Chart from "../Chart";
import { withStyles } from "@material-ui/core/styles";
import ItemsPanel from "../components/ItemsPanel";
import GetSchole from "../utils/Bscholes";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import GitHubIcon from "@material-ui/icons/GitHub";
import OptionsForm from "../components/OptionsForm";

const useRowStyles = (theme) => ({
  root: {
    margin: theme.spacing(2),
    // display: "table",
    backgroundColor: "rgb(38, 38, 38)",
    "& > *": {
      borderBottom: "unset",
    },
    //width: "100%",
    flexWrap: "wrap",
  },
  title: {
    flexGrow: 1,
  },
  table: {
    minWidth: 0,
    backgroundColor: "rgb(179, 179, 179)",
  },
  container: {
    backgroundColor: "lightgray",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    height: 500,
    overflow: "scroll",
    display: "block",
  },
  paper: {
    backgroundColor: "rgb(128, 0, 0)",
    padding: theme.spacing(2),
    // display: "flex",
    overflow: "auto",
    // // flexDirection: "row",
    maxHeight: "auto",
  },
  chartGrid: {
    backgroundColor: "rgb(128, 0, 0)",
    padding: theme.spacing(2),
    display: "block",
    // overflow: "auto",
    flexDirection: "row",
    flex: 1,
    maxHeight: "auto",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  paperHeader: {
    backgroundColor: "rgb(128, 0, 0)",
    padding: theme.spacing(0),
    flexDirection: "row",
  },
  fixedHeight: {
    height: 300,
  },
  expPanelCall: {
    backgroundColor: "rgb(0, 77, 0)",
  },
  expPanelPut: {
    backgroundColor: "rgb(128, 26, 0)",
  },
  selectedTable: {
    backgroundColor: "gray",
  },
  headerPaper: {
    //Top level
    margin: theme.spacing(3),
    // color: "rgb(191, 191, 191)",
    // backgroundColor: "rgb(128, 0, 0)",
    display: "block",
    flexGrow: 1,
  },
  headerButton: {
    margin: theme.spacing(1),
    color: "black",
    backgroundColor: "rgb(204, 204, 204)",
    flexGrow: 1,
  },
  headerBlock: {
    // margin: theme.spacing(1),
    // backgroundColor: "rgb(128, 0, 0)",
    // color: "white",
    // padding: theme.spacing(2),
    //flexGrow: 1,
  },
});

const TempPrice =[
  [
    //{oPrice:0,sPrice:0}
  ],
]
const mainObj = {
  type: "call",
  buySell: "buy",
  stockPrice: 304.5,
  strikePrice: 306,
  expiration: 3,
  interestFree: 0.02,
  volatility: 55,
  greeks: [
    { volatility: "55%", delta: ".5", amount: 3 },
    { volatility: "59%", delta: ".2", amount: 1 },
  ],
  GUID: "",
  isEditing: false,
  priceArray:TempPrice,
};


export class ParentComp extends React.Component {
  constructor(props) {
    super(props);
    mainObj.GUID = this.uuidv4();
    this.state = {
      checksList: [],
      currentEdit: mainObj,
      //calculatedPriceData: TempPrice,
      optionsData: mainObj,
    };
    this.addData = this.addData.bind(this);
    this.clearSelected = this.clearSelected.bind(this);
    this.calculateOptionsPrice = this.calculateOptionsPrice.bind(this);
    this.getGuid = this.getGuid.bind(this);
  }

  addData(val) {
    var result = this.state.checksList.find((obj) => {
      return obj.GUID === val.GUID;
    });

    if (!result) {
      return () => {
        this.setState({
          checksList: this.state.checksList.concat(val),
        });
      };
    }
  }

  clearSelected() {
    this.setState({
      checksList: [],
    });
  }

  createData(
    type,
    buysell,
    stockPrice,
    strikePrice,
    expiration,
    interestFree,
    volatility,
    GUID
  ) {
    return {
      type,
      buysell,
      stockPrice,
      strikePrice,
      expiration,
      interestFree,
      volatility,
      greeks: [
        { volatility: "55%", delta: ".5", amount: 3 },
        { volatility: "59%", delta: ".2", amount: 1 },
      ],
      GUID,
    };
  }

  calculateOptionsPrice() {
    var input;
    if (!this.state.checksList[this.state.checksList.length - 1])
      input = this.state.optionsData;
    else input = this.state.checksList[this.state.checksList.length - 1];

    const res = GetSchole(input);
    //input = this.state.calculatedPriceData;
    this.setState({
      optionsData: res,
    });
  }

  uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
      c
    ) {
      var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  saveText(text, filename) {
    var a = document.createElement("a");
    a.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    a.setAttribute("download", filename);
    a.click();
  }

  componentDidMount() {
    this.calculateOptionsPrice();
  }

  getFormData(val) {
    var indexFound = -1;
    for (let i = 0; i < this.state.checksList.length; i++) {
      if (this.state.checksList[i].GUID === val.GUID) {
        indexFound = i;
        break;
      }
    }

    if (indexFound === -1) {
      //add
      this.setState({
        checksList: this.state.checksList.concat(val),
      });
    } else {
      var newState = this.state.checksList;
      newState[indexFound] = val;
      this.setState({
        checksList: newState,
      });
    }
  }

  getGuid(row) {
    return () => {
      this.setState({
        currentEdit: row,
      });
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid container>
            <Chart
              selectedItems={this.state.checksList}
              priceArray={this.state.optionsData.priceArray}
            ></Chart>
          </Grid>

          <Grid spacing={3} item xs={12}>
            <ItemsPanel
              classes={classes}
              clearSelected={() => this.clearSelected()}
              getGuid={(val) => this.getGuid(val)}
              selectedItems={this.state.checksList}
              calculateOptionsPrice={() => this.calculateOptionsPrice()}
            ></ItemsPanel>
          </Grid>
          <Grid
            //spacing={3}
            item
            xs={12}
          >
            <OptionsForm
              getFormData={(val) => this.getFormData(val)}
              currentEdit={this.state.currentEdit}
            ></OptionsForm>
          </Grid>
          {/* <Grid item xs={6}>
            <ChainData
              checksList={this.state.checksList}
              addDataFunc={(val) => this.addData(val)}
              rowData={this.state.rowData}
              optionType={"Call"}
              classes={classes}
            ></ChainData>
          </Grid>
          <Grid item xs={6}>
            <ChainData
              checksList={this.state.checksList}
              addDataFunc={(val) => this.addData(val)}
              rowData={this.state.rowData}
              optionType={"Put"}
              classes={classes}
            ></ChainData>
          </Grid> */}
        </Grid>
        <BottomNavigation
          value={1}
          // onChange={(event, newValue) => {
          //   setValue(newValue);
          // }}
          showLabels
          className={classes.root}
        >
          <BottomNavigationAction
            icon={<GitHubIcon />}
            href={"https://github.com/Joas3068/OptionsProfitCalculator"}
          />
        </BottomNavigation>
      </div>
    );
  }
}

export default withStyles(useRowStyles)(ParentComp);
