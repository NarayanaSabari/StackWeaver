exports.getTest = (req, res) => {
    console.log('getTest: Function called');
    try {
        const testData = {
            message: 'Hello, World!',
            timestamp: new Date().toISOString()
        };
        console.log('getTest: Test data:', testData);
        res.status(200).json(testData);
    } catch (err) {
        console.error('getTest: Error:', err);
        errorHandler(err, res);
    }
};