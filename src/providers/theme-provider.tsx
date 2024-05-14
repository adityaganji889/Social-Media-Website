import { ConfigProvider } from 'antd'
import React, { Children } from 'react'

interface Props {
  children: React.ReactNode
}

const ThemeProvider : React.FC<Props> = ({children}) => {

  const primaryColor = "#054058";
  const secondaryColor = "#F3C110";

  return (
    <ConfigProvider
     theme={{
        token: {
            // borderRadius: 10
            colorPrimary: primaryColor,
        },
        components: {
            Button: {
                borderRadius: 10,
                controlHeight: 45
            }
        }
     }}
    >
        {children}
    </ConfigProvider>
  )
}

export default ThemeProvider