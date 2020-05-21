const wordsPerMinute = 200; // Average case.

const wordsToMins = (text) => {
    if (text){
        const textLength = text.split(' ').length; // Split by words
        if (textLength > 0){
            return Math.ceil(textLength / wordsPerMinute);
        }
    }

    return 0;
};

export default wordsToMins;
