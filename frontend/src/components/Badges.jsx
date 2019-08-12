import MuiBadge from '@material-ui/core/Badge';
import { styled } from '@material-ui/core/styles';

const DoneBadge = styled(MuiBadge)({
  minWidth: '3rem',
  padding: '0 6px',
  textAlign: 'center',
  // -webkit-box-sizing: 'border-box',
  boxSizing: 'border-box',

  fontWeight: '300',
  fontSize: '0.9rem',
  backgroundColor: '#26a69a',
  borderRadius: '2px',

  color: "white",
});

const NotDoneBadge = styled(DoneBadge)({
  backgroundColor: "#337ab7",
});

export { DoneBadge, NotDoneBadge };
