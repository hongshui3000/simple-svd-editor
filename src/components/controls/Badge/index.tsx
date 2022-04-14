import { useTheme, scale, typography } from '@scripts/gds';
import { STATUSES } from '@scripts/enums';

export interface BadgeProps {
    text: string;
    type?: STATUSES;
}

const Badge = ({ text, type }: BadgeProps) => {
    const { colors } = useTheme();
    let backgroundColor;
    switch (type) {
        case STATUSES.CREATED: {
            backgroundColor = colors?.primary;
            break;
        }
        case STATUSES.SUCCESS: {
            backgroundColor = colors?.success;
            break;
        }
        case STATUSES.ERROR: {
            backgroundColor = colors?.danger;
            break;
        }
        case STATUSES.WARNING: {
            backgroundColor = colors?.warning;
            break;
        }
        default: {
            backgroundColor = colors?.secondaryHover;
        }
    }

    return (
        <div
            css={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor,
                color: colors?.white,
                borderRadius: 2,
                padding: `1px ${scale(1, true)}px`,
                whiteSpace: 'pre-line',
                ...typography('smallBold'),
            }}
        >
            {text}
        </div>
    );
};

export default Badge;
