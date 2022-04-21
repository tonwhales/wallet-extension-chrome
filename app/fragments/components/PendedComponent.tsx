import React from "react"
import { View, Text } from "react-native"
import { IS_TESTNET } from "../../api/client"

export const PendedComponent = React.memo(() => {

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '100px' }}>
            <div style={{ width: '170px', marginBottom: '-10px', position: 'relative' }}>
                <div className='loader'>
                    <svg height="100%" viewBox="0 0 160 160" width="100%">
                        <circle
                            cx="80"
                            cy="80"
                            fill="none"
                            r="40"
                            strokeWidth="5"
                            style={{
                                stroke: IS_TESTNET ? '#F1A03A' : 'rgb(26, 149, 224)',
                                opacity: 0.2,
                            }}
                        />
                        <circle
                            className="circle"
                            cx="80"
                            cy="80"
                            fill="none"
                            r="40"
                            strokeWidth="5"
                            style={{
                                stroke: IS_TESTNET ? '#F1A03A' : 'rgb(26, 149, 224)',
                                strokeDasharray: 125,
                                strokeDashoffset: 30,
                            }}
                        />
                    </svg>
                    <svg style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '41%', animation: 'none' }} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M27.7932 0.924485L2.45666 10.299C0.176377 11.1858 0.176377 14.3528 2.58334 15.1129L9.4242 17.3932C10.691 17.7733 12.0845 17.5199 13.2247 16.7598L25.0061 7.13193L15.3783 18.9134C14.4915 19.9269 14.2381 21.3204 14.7449 22.7139L17.0252 29.5547C17.7852 31.835 21.079 31.9617 21.8391 29.6814L31.0869 4.47159C31.847 2.19131 29.8201 0.164389 27.7932 0.924485ZM5.87707 19.5468C6.3838 20.0535 6.3838 20.687 5.87707 21.1937L4.23019 22.8406C3.72346 23.3473 3.09005 23.3473 2.58332 22.8406C2.07659 22.3338 2.07659 21.7004 2.58332 21.1937L4.23019 19.5468C4.73692 19.0401 5.37034 19.0401 5.87707 19.5468ZM9.1708 21.1937C9.67753 20.687 10.3109 20.687 10.8177 21.1937C11.1977 21.7004 11.1977 22.4605 10.691 22.9672L5.87705 27.7812C5.37032 28.2879 4.73691 28.2879 4.23018 27.7812C3.72345 27.2744 3.72345 26.641 4.23018 26.1343L9.1708 21.1937ZM9.17084 27.7812L10.8177 26.1343C11.1978 25.6276 11.9579 25.6276 12.4646 26.1343C12.9713 26.641 12.9713 27.2744 12.4646 27.7812L10.8177 29.428C10.311 29.9348 9.67757 29.9348 9.17084 29.428C8.66411 28.9213 8.66411 28.2879 9.17084 27.7812Z" fill={IS_TESTNET ? '#F1A03A' : 'rgb(26, 149, 224)'} />
                    </svg>
                </div>
            </div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <Text style={{ color: 'white', fontSize: 16, lineHeight: 20 }}>Awaiting</Text>
                <Text style={{ color: 'white', fontSize: 16, lineHeight: 20 }}>confirmation...</Text>
            </div>
        </View>
    )
})