import React, { PureComponent } from "react"
import { Column, Cell } from "fixed-data-table-2"
import FontIcon from "material-ui/FontIcon"
import { NOMAD_WATCH_ALLOCATION_HEALTH, NOMAD_UNWATCH_ALLOCATION_HEALTH } from "../../sagas/event"
import { green500, red500 } from "material-ui/styles/colors"

const AllocationConsulHealthCell = ({ rowIndex, dispatch, allocationHealth, nodes, data, ...props }) => (
  <Cell rowIndex={rowIndex} data={data} {...props}>
    <AllocationConsulHealth dispatch={dispatch} allocation={data[rowIndex]} allocationHealth={allocationHealth} />
  </Cell>
)
export { AllocationConsulHealthCell }

class AllocationConsulHealth extends PureComponent {
  componentDidMount() {
    this.watch(this.props)
  }

  componentWillUnmount() {
    this.unwatch(this.props)
  }

  componentWillReceiveProps(nextProps) {
    // if we get a new allocation, unsubscribe from the old and subscribe to the new
    if (this.props.allocation.ID != nextProps.allocation.ID) {
      this.unwatch(this.props)
      this.watch(nextProps)
      return
    }

    // if the current allocation changed from running to something else, unsubscribe
    if (this.props.allocation.ClientStatus == "running" && nextProps.allocation.ClientStatus != "running") {
      this.unwatch(this.props)
    }

    // if the current allocation changed anything to running, subscrube to health
    if (this.props.allocation.ClientStatus != "running" && nextProps.allocation.ClientStatus == "running") {
      this.watch(nextProps)
    }
  }

  shouldComponentUpdate() {
    return true
  }

  unwatch(props) {
    if (props.allocation.ClientStatus != "running") {
      return
    }

    this.props.dispatch({
      type: NOMAD_UNWATCH_ALLOCATION_HEALTH,
      payload: {
        id: props.allocation.ID,
        client: props.allocation.NodeID
      }
    })
  }

  watch(props) {
    if (props.allocation.ClientStatus != "running") {
      return
    }

    this.props.dispatch({
      type: NOMAD_WATCH_ALLOCATION_HEALTH,
      payload: {
        id: props.allocation.ID,
        client: props.allocation.NodeID
      }
    })
  }

  render() {
    const allocID = this.props.allocation.ID
    const health = this.props.allocationHealth[allocID]

    if (!health) {
      return null
    }

    let icon = ""

    if (health.Healthy) {
      icon = (
        <FontIcon color={green500} className="material-icons">
          {health.Total > 1 ? "done_all" : "done"}
        </FontIcon>
      )
    }

    if (health.Healthy == false) {
      icon = (
        <FontIcon color={red500} className="material-icons">
          clear
        </FontIcon>
      )
    }

    return <span>{icon}</span>
  }
}

export default AllocationConsulHealth
