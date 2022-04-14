import { HTMLProps, ReactNode } from 'react';
import cn from 'classnames';
import { Tab as ReactTab } from 'react-tabs';
import { useTheme, typography } from '@scripts/gds';

export interface TabsTabProps extends HTMLProps<HTMLLIElement> {
    /** Heading content */
    children: ReactNode;
    /** Disabled tab */
    disabled?: boolean;
    /** Counter for tab */
    count?: number;
    /** Need marker */
    marker?: boolean;
}

export const TabsTab = ({ children, className, count, marker, ...props }: TabsTabProps) => {
    const baseClass = 'tabs__tab';
    const classes = cn(baseClass, className);
    const { components } = useTheme();
    const tabsTheme = components?.Tabs;

    return (
        <ReactTab
            className={classes}
            selectedClassName={`${baseClass}--selected`}
            disabledClassName={`${baseClass}--disabled`}
            {...props}
        >
            <span
                css={
                    marker
                        ? {
                              paddingRight: (tabsTheme?.markerMargin || 0) + (tabsTheme?.markerSize || 0),
                              position: 'relative',
                              '&::before': {
                                  content: "''",
                                  position: 'absolute',
                                  right: tabsTheme?.markerRight,
                                  top: tabsTheme?.markerTop,
                                  borderRadius: '50%',
                                  width: tabsTheme?.markerSize,
                                  height: tabsTheme?.markerSize,
                                  background: tabsTheme?.markerBg,
                                  '[class$=--disabled] &': {
                                      background: 'inherit',
                                  },
                              },
                          }
                        : undefined
                }
            >
                {children}
                {typeof count === 'number' ? (
                    <span
                        css={{
                            ...(tabsTheme?.counterTypography && typography(tabsTheme.counterTypography)),
                            display: 'inline-block',
                            verticalAlign: 'text-bottom',
                            padding: tabsTheme?.counterPadding,
                            background: tabsTheme?.counterBg,
                            border: tabsTheme?.counterBorder,
                            borderRadius: tabsTheme?.counterBorderRadius,
                            marginLeft: tabsTheme?.counterMargin,
                            color: tabsTheme?.counterColor,
                            '[class$=--disabled] &': {
                                color: 'inherit',
                                borderColor: tabsTheme?.counterDisabledBorderColor,
                                background: tabsTheme?.counterDisabledBg,
                            },
                        }}
                    >
                        {count}
                    </span>
                ) : null}
            </span>
        </ReactTab>
    );
};

export default TabsTab;
