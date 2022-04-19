import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { View } from 'react-native';
import { animate } from 'motion';

const NavigationContext = React.createContext<{
    navigate: (component: React.ReactElement<{}>) => void,
    back: () => void
}>(null as any);

export function useNavigation() {
    return React.useContext(NavigationContext);
}

const Page = React.memo((props: { children?: any, id: string, animate: boolean, exit: boolean, onExited: (key: string) => void }) => {

    let contentRef = React.useRef<View>(null);
    let shadowRef = React.useRef<View>(null);

    // Animate appearance
    React.useLayoutEffect(() => {
        if (props.animate) {
            const domNode = ReactDOM.findDOMNode(contentRef.current) as Element;
            const shadow = ReactDOM.findDOMNode(shadowRef.current) as Element;
            animate(domNode, { x: 350 }, { duration: 0 });
            animate(domNode, { x: 0 }, { duration: 0.3 });
            animate(shadow, { opacity: 0 }, { duration: 0 });
            animate(shadow, { opacity: 0.6 }, { duration: 0.3 });
        }
    }, []);

    // Animate exit
    React.useLayoutEffect(() => {
        if (props.exit) {
            const domNode = ReactDOM.findDOMNode(contentRef.current) as Element;
            const shadow = ReactDOM.findDOMNode(shadowRef.current) as Element;
            animate(domNode, { x: 350 }, { duration: 0.3 }).finished.then(() => props.onExited(props.id));
            animate(shadow, { opacity: 0 }, { duration: 0.3 });
        }
    }, [props.exit]);

    return (
        <View
            pointerEvents="box-none"
            style={[{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }]}
        >
            <View
                ref={shadowRef}
                style={[{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0,
                    backgroundColor: 'black'
                }]}
            />

            <View
                ref={contentRef}
                style={[{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#222222',
                    // opacity: props.animate ? 0 : 1,
                    // transform: props.animate ? [{ translateX: 350 }] : []
                }]}
            >
                {props.children}
            </View>
        </View>
    );
});

export const SimpleNavigation = React.memo((props: { initialComponent: React.ReactElement<{}> }) => {

    const [stack, setStack] = React.useState<{
        key: string,
        component: React.ReactElement<{}>,
        exiting: boolean
    }[]>([{ key: 'init', component: props.initialComponent, exiting: false }]);

    const onExited = React.useCallback((src: string) => {
        setStack((s) => s.filter((v) => v.key !== src));
    }, []);

    const ctx = React.useMemo(() => ({
        navigate: (component: React.ReactElement<{}>) => {
            setStack((s) => [...s, { key: Math.random() + '--', component, exiting: false }]);
        },
        back: () => {
            const last = [...stack].reverse().find((v) => !v.exiting);
            console.warn(last);
            if (last) {
                setStack((s) => s.map((v) => ({ ...v, exiting: v.exiting || v.key === last.key })));
            }
        }
    }), [stack]);

    return (
        <NavigationContext.Provider value={ctx}>
            {stack.map((v, i) => (
                <Page key={v.key} id={v.key} animate={i != 0} exit={v.exiting} onExited={onExited}>
                    {v.component}
                </Page>
            ))}
        </NavigationContext.Provider>
    )
});