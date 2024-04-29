const handleButtonPress = async () => {
    try {
      const response = await fetch('http://192.168.220.66:8000/random-response');
      const data = await response.json();
      if (response.ok) {
        // Show success Snackbar
        setSnackbarMessage('Data updated successfully!');
      } else {
        // Show error Snackbar
        setSnackbarMessage('Failed to update data');
      }
    } catch (error) {
      console.error('Error updating data:', error);
      // Show error Snackbar
      setSnackbarMessage('Failed to update data');
    }
    setSnackbarVisible(true);
  };

  const handleSnackbarDismiss = () => setSnackbarVisible(false);