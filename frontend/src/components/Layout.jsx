import React from 'react';
import { SnackbarProvider } from 'notistack';
import { styled } from "@material-ui/core/styles";
import NavBar from './NavBar';

const StyledDiv = styled('div')({
  width: '85%',
  margin: 'auto',
  overflowX: 'auto',
  padding: '1px',
});

export default function Layout({ children, profileUrl, fullName }) {
  return (
    <SnackbarProvider
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={2000}
    >
      <NavBar profileUrl={profileUrl} fullName={fullName} />
      <StyledDiv>{children}</StyledDiv>
    </SnackbarProvider>
  );
}