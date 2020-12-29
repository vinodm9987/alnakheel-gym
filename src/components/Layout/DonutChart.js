import { withTranslation } from 'react-i18next'
import React, { Component } from 'react'

class DonutChart extends Component {

  state = {
    value: 45,
    size: 116,
    strokewidth: 15,
    dataValue: 45,
  }

  render() {
    const dataValue = (this.props.dataValue || this.props.dataValue === 0) ? this.props.dataValue : this.state.dataValue
    const value = (this.props.dataValue || this.props.dataValue === 0) ? this.props.value : this.state.value
    const size = this.props.size ? this.props.size : this.state.size
    const strokewidth = this.props.strokewidth ? this.props.strokewidth : this.state.strokewidth
    const halfsize = (size * 0.5);
    const radius = halfsize - (strokewidth * 0.5);
    const circumference = 2 * Math.PI * radius;
    const strokeval = ((value * circumference) / 100);
    const dashval = (strokeval + ' ' + circumference);
    const trackstyle = { strokeWidth: strokewidth };
    const indicatorstyle = { strokeWidth: strokewidth, strokeDasharray: dashval }
    const rotateval = 'rotate(-90 ' + halfsize + ',' + halfsize + ')';

    return (
      <svg width={size} height={size}>
        <circle r={radius} cx={halfsize} cy={halfsize} transform={rotateval} style={trackstyle} className="donutchart-track" />
        <circle r={radius} cx={halfsize} cy={halfsize} transform={rotateval} style={indicatorstyle} className="donutchart-indicator" />
        <text x={halfsize} y={halfsize - 9} style={{ textAnchor: 'middle' }} >
          <tspan style={{ fontSize: '12px' }}>{dataValue}</tspan>
        </text>
        {this.props.text1 &&
          <text x={halfsize} y={halfsize + 4} style={{ textAnchor: 'middle' }} >
            <tspan style={{ fontSize: '12px' }}>{this.props.text1}</tspan>
          </text>
        }
        {this.props.text2 &&
          <text x={halfsize} y={halfsize + 17} style={{ textAnchor: 'middle' }} >
            <tspan style={{ fontSize: '12px' }}>{this.props.text2}</tspan>
          </text>
        }
      </svg>
    )
  }
}

export default withTranslation()(DonutChart)