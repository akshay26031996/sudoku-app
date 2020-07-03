import React from "react";

type CellProperties = {
  row: number;
  column: number;
  value: number | null;
  hasConflict: boolean;
  isEditable: boolean;
};

interface CellProps {
  cell: CellProperties;
  board: any;
}

class Cell extends React.Component<CellProps> {
  constructor(props: any) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  public static newCell(
    row: number,
    column: number,
    value: number | null,
    hasConflict: boolean,
    isEditable: boolean
  ) {
    return { row, column, value, hasConflict, isEditable };
  }

  onClick(event: any) {
    event.preventDefault();
    if (this.props.cell.isEditable) {
      event.target.select();
    } else {
      event.target.blur();
    }
  }
  onChange(event: any) {
    event.preventDefault();
    var cell = this.props.cell;
    if (!cell.isEditable) {
      return;
    }
    var newValue = event.target.value;
    if (newValue !== "" && !/^[1-9]$/.test(newValue)) {
      event.target.value = cell.value;
      return;
    }
    if (newValue !== "") {
      if (
        this.props.board.is_valid_filler(
          parseInt(newValue),
          this.props.cell.row,
          this.props.cell.column
        )
      ) {
        this.props.board.set_cell_value(
          parseInt(newValue),
          this.props.cell.row,
          this.props.cell.column
        );
        this.props.cell.hasConflict = false;
        this.setState({ cell: this.props.cell });
      } else {
        this.props.board.remove_cell_value(
          this.props.cell.row,
          this.props.cell.column
        );
        this.props.cell.hasConflict = true;
        this.setState({ cell: this.props.cell });
      }
    } else {
      this.props.board.remove_cell_value(
        this.props.cell.row,
        this.props.cell.column
      );
      this.props.cell.hasConflict = false;
      this.setState({ cell: this.props.cell });
    }
  }

  render() {
    let cell = this.props.cell;
    let value;
    if (cell.value != null) {
      value = cell.value;
    }
    let classes = [];
    classes.push("i" + cell.row);
    classes.push("j" + cell.column);
    classes.push(cell.isEditable ? "editable" : "not-editable");
    classes.push(cell.hasConflict ? "has-conflict" : "no-conflict");
    return (
      <td className={classes.join(" ")}>
        <input
          type="tel"
          readOnly={!this.props.cell.isEditable}
          value={value}
          onClick={this.onClick}
          onChange={this.onChange}
        />
      </td>
    );
  }
}

export default Cell;
