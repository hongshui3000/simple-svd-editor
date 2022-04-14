import { useTheme } from '@scripts/gds';

interface HeaderDobuleProps {
    headerText: string;
    smallText: string;
}

const HeaderDobule = ({ headerText, smallText }: HeaderDobuleProps) => {
    const { colors } = useTheme();

    return (
        <>
            <p>{headerText}</p>
            <p
                css={{
                    color: colors?.grey800,
                    fontWeight: 'normal',
                    whiteSpace: 'pre',
                }}
            >
                {smallText}
            </p>
        </>
    );
};

export default HeaderDobule;
