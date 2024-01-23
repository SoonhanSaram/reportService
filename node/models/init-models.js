import _corporationinfo from "./corporationinfo.js";
import _userinfo from "./userinfo.js";
import _fileinfo from "./fileinfo.js";
import _reportCommon from './reportCommon.js';
import _dailyReports from './dailyReports.js';
import _weeklyReports from './weeklyReports.js';
import _roleinfo from './roleinfo.js';

const initModels = (sequelize) => {
  const corporationinfo = _corporationinfo(sequelize);
  const userinfo = _userinfo(sequelize);
  const fileinfo = _fileinfo(sequelize);
  const reportcommon = _reportCommon(sequelize);
  const dailyreports = _dailyReports(sequelize);
  const weeklyreports = _weeklyReports(sequelize);
  const roleinfo = _roleinfo(sequelize);

  userinfo.belongsTo(corporationinfo, { as: "corp_belongto_corporationinfo", foreignKey: "corp_belongto" });
  corporationinfo.hasMany(userinfo, { as: "userinfos", foreignKey: "corp_belongto" });

  userinfo.belongsTo(roleinfo, { foreignKey: 'user_authority' });
  roleinfo.hasMany(userinfo, { foreignKey: 'user_authority' });

  dailyreports.belongsTo(reportcommon, { as: 'reportcommon', foreignKey: 'report_seq' });
  weeklyreports.belongsTo(reportcommon, { as: 'reportcommon', foreignKey: 'report_seq' });

  return {
    corporationinfo,
    userinfo,
    fileinfo,
    reportcommon,
    dailyreports,
    weeklyreports,
    roleinfo,
  };
}
export default initModels;

