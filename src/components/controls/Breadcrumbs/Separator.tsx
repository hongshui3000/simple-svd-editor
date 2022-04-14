import { scale, useTheme } from '@scripts/gds';

const Separator = () => {
    const { colors } = useTheme();
    return <span css={{ margin: `0 ${scale(1)}px`, display: 'inline-block', color: colors?.grey600 }}> / </span>;
};

export default Separator;
