import React from "react";
import { View, Text } from "react-native";
import { useNavigation } from "./SimpleNavigation";

export const HeaderComponent = React.memo((props: { text: string, action?: () => void }) => {
	return (
		<View style={{ backgroundColor: '#303030', paddingVertical: 18, alignItems: 'center', width: '100%', borderBottomColor: 'rgba(255, 255, 255, 0.04)', borderBottomWidth: 1, position: 'relative' }}>
			{props.action && <div className='navBtn'
				onClick={props.action}
				style={{
					borderRadius: 6,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					position: 'absolute',
					left: '10px',
					top: '50%',
					transform: 'translateY(-48%)',
					width: 36,
					height: 36,
					cursor: 'pointer'
				}}>
				<svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path fill-rule="evenodd" clip-rule="evenodd" d="M9.62042 2.03395C10.1265 1.56853 10.1265 0.814368 9.62042 0.348892C9.11404 -0.116297 8.29354 -0.116297 7.78712 0.348892L0.379585 7.15747C-0.126528 7.6229 -0.126528 8.37706 0.379585 8.84253L7.78712 15.6511C8.29349 16.1163 9.11399 16.1163 9.62042 15.6511C10.1265 15.1857 10.1265 14.4315 9.62042 13.966L3.12593 7.99669L9.62042 2.03395Z" fill="#EBEBEB" />
				</svg>
			</div>}
			<Text style={{ color: '#fff', fontSize: 18, lineHeight: 20 }}>{props.text}</Text>
		</View>
	)
});