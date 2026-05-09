import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={26}
    height={26}
    fill="none"
    {...props}
  >
    <Path
      stroke="#8E8E93"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.167}
      d="M16.25 22.75v-8.667c0-.598-.485-1.083-1.083-1.083h-4.334c-.598 0-1.083.485-1.083 1.083v8.667"
    />
    <Path
      stroke="#8E8E93"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.167}
      d="M3.25 10.833c0-.638.28-1.243.768-1.655l7.583-6.5a2.167 2.167 0 0 1 2.798 0l7.583 6.5c.487.412.768 1.017.768 1.655v9.75c0 1.196-.97 2.167-2.167 2.167H5.417a2.168 2.168 0 0 1-2.167-2.167v-9.75"
    />
  </Svg>
)
export { SvgComponent as HomeIconSvg }
