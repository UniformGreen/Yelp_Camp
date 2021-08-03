module.exports.getLastUpdated = ( ms ) => {
    const oneDay = 1000 * 60 * 60 * 24;
    const days = (Date.now() - ms) / oneDay;
    if (days < 1) {
        return 'Just today';
    } else if (days < 2) {
        return '1 day ago'
    }     
    return Math.floor(days) + ' ago';    
}