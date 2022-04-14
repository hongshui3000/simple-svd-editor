import { useMemo } from 'react';
import { CSSObject } from '@emotion/core';
import { useTheme, scale, typography } from '@scripts/gds';

export const useFilePondStyles = () => {
    const { colors, components } = useTheme();
    const IT = components?.Input;

    const styles: CSSObject = useMemo(
        () => ({
            '&.file-input': {
                fontFamily: 'inherit',

                '.filepond--root': {
                    ...typography('bodySm'),
                    marginBottom: 0,
                },

                '.filepond--list-scroller': {
                    position: 'static',
                    margin: 0,
                },

                '.filepond--list': {
                    position: 'static',

                    ':first-of-type': {
                        marginTop: scale(2),
                    },
                },

                '.filepond--item': {
                    position: 'static',
                    marginLeft: 0,
                    marginRight: 0,

                    '.image-preview&': {
                        width: `calc(33% - ${scale(3, true)}px)`,
                        marginBottom: scale(2),
                        marginRight: scale(2),

                        '&:nth-of-type(3n)': {
                            marginRight: 0,
                        },
                    },
                },

                '.filepond--drop-label': {
                    display: 'flex',
                    alignItems: 'stretch',
                    minHeight: scale(14),
                    color: IT?.color,
                    border: `1px dashed ${IT?.borderColor}`,
                    borderRadius: IT?.borderRadius,
                    background: IT?.bg,
                    cursor: 'pointer',
                    label: {
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        width: '100%',
                        transition: 'background 200ms ease-out',
                        ':hover': { background: colors?.infoBg },
                    },
                    textRendering: 'optimizeLegibility',
                    '.filepond--image-placeholder': {
                        width: scale(4),
                        height: scale(4),
                        margin: `0 auto ${scale(1)}px`,
                    },
                },

                '.filepond--label-action': {
                    textDecoration: 'none',
                    color: colors?.grey900,
                    ...typography('bodySm'),
                },

                '.filepond--panel-root': {
                    background: 'none',
                },

                '.filepond--item-panel': {
                    borderRadius: scale(1),
                    background: 'none',
                    boxShadow: 'none',
                    padding: 0,
                    paddingBottom: scale(1),
                },

                '[data-filepond-item-state="processing-complete"] .filepond--item-panel ': {
                    backgroundColor: colors?.grey400,
                },

                '.filepond--drip-blob': {
                    backgroundColor: colors?.grey400,
                },
                '.filepond--file': {
                    padding: 0,
                },
                '.filepond--file-info': {
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    paddingRight: scale(3),
                    ...typography('bodySm'),
                    '.image-preview&': { background: colors?.white, alignSelf: 'flex-start' },
                },
                '.filepond--action-remove-item': {
                    top: 2,
                    right: 0,
                    width: scale(2),
                    height: scale(2),
                    ':hover': { boxShadow: 'none !important', opacity: '0.8 !important' },

                    '&::after': {
                        width: scale(3),
                        height: scale(3),
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        right: 'initial',
                        bottom: 'initial',
                    },
                },
                '.filepond--file-status': {
                    display: 'none',

                    '.image-preview&': {
                        display: 'block',
                        paddingTop: scale(1),
                        paddingBottom: scale(1),
                        background: colors?.white,
                    },
                },
                '.filepond--file-info-main': {
                    ...typography('bodySm'),
                    color: colors?.grey900,
                    flexGrow: 1,
                },
                '.filepond--file-info-sub': {
                    fontSize: '14px',
                    color: colors?.grey900,
                },
                // '.filepond--item > .filepond--panel .filepond--panel-bottom ': {
                //     boxShadow: 'none',
                // },
                '.filepond--file-info .filepond--file-info-main': {
                    width: 'auto',
                    marginRight: scale(1),
                },

                '.filepond--file-action-button': {
                    color: colors?.grey900,
                    backgroundColor: colors?.white,
                    cursor: 'pointer',

                    '&:hover': {
                        boxShadow: `0 0 0 0.125em ${colors?.danger}`,
                    },
                },

                '[data-filepond-item-state*="error"] .filepond--item-panel,[data-filepond-item-state*="invalid"] .filepond--item-panel':
                    {
                        background: 'none',
                    },
                '.filepond--file-status-main': {
                    fontSize: '12px',
                    color: colors?.grey900,
                },
                '[data-filepond-item-state="processing-error"] .filepond--file-status-main': {
                    color: colors?.danger,
                },
                '[data-filepond-item-state="load-invalid"] .filepond--file-status-main': {
                    color: colors?.danger,
                },
                '.filepond--file-status-sub': {
                    fontSize: '10px',
                    color: colors?.grey900,
                    opacity: 1,
                },
                '.filepond--progress-indicator': {
                    color: colors?.grey900,
                    marginTop: 0,

                    '&::before, &::after': {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        height: '2px',
                        width: '9px',
                        content: "''",
                        background: colors?.grey900,
                    },

                    '&::before': {
                        transform: 'translate(-50%, -50%) rotate(45deg)',
                    },

                    '&::after': {
                        transform: ' translate(-50%, -50%) rotate(-45deg)',
                    },
                },
            },
        }),
        [
            IT?.bg,
            IT?.borderColor,
            IT?.borderRadius,
            IT?.color,
            colors?.danger,
            colors?.grey400,
            colors?.grey900,
            colors?.infoBg,
            colors?.white,
        ]
    );
    return styles;
};
