module.exports = addUserDat;

function addUserDat(html, userdat) {
    // console.log(userdat);
    return html
        .replaceAll("[user]", userdat.user)
        .replace("[userid]", userdat.id)
        .replace("[pass]", userdat.password);
}
