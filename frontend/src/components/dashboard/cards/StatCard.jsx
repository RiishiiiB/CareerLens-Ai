import Card from "../../ui/Card";

const StatCard = ({ title, value, subtitle, icon: Icon }) => {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-400">{title}</p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          {value}
        </h2>

        {subtitle && (
          <p className="mt-2 text-sm text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {Icon && (
        <div className="rounded-xl bg-blue-600/20 p-3">
          <Icon className="text-blue-500" size={28} />
        </div>
      )}
    </Card>
  );
};

export default StatCard;