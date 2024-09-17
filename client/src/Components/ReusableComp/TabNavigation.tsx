import React, { FC, useState } from "react";

interface Tab {
  id: number;
  label: string;
  component?: React.ReactNode;
  data?:
    | {
        description: string;
        materialComposition?: string;
        fitType?: string;
        sleeveType?: string;
        length?: string;
        neckStyle?: string;
        countryOfOrigin?: string;
      }
    | string;
}

interface TabNavigationProps {
  tabs: Tab[];
}

const TabNavigation: FC<TabNavigationProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleTabClick = (tabId: number) => {
    setActiveTab(tabId);
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-row  gap-6 overflow-x-auto  scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`font-bold md:text-2xl whitespace-nowrap text-xl ${
              activeTab === tab.id
                ? "md:p-4 p-2 text-orange-400 md:border-b-[3px] border-b-2 border-orange-400"
                : "md:p-4 p-2"
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="ml-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? "block" : "hidden"}
          >
            {tab.component}
            <div>
              {typeof tab.data === "object" && (
                <ul>
                  {Object.entries(tab.data).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}: </strong>
                      {value}
                    </li>
                  ))}
                </ul>
              )}
              {typeof tab.data === "string" && <p className="font-ubuntu text-sm md:w-96">{tab.data}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
