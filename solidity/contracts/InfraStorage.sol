// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title InfraStorage - Čuva geolokaciju prijavljenih problema i njihov prioritet
contract InfraStorage {
    struct Report {
        int32 latE6;     // latitude * 1e6
        int32 lonE6;     // longitude * 1e6
        uint8 priority;  // 1-10 recimo
        uint256 createdAt;
        address reporter;
    }

    Report[] public reports;

    event ReportCreated(
        uint256 indexed id,
        int32 latE6,
        int32 lonE6,
        uint8 priority,
        uint256 createdAt,
        address indexed reporter
    );

    function createReport(
        int32 latE6,
        int32 lonE6,
        uint8 priority
    ) external returns (uint256) {
        require(priority > 0, "Priority > 0");

        Report memory r = Report({
            latE6: latE6,
            lonE6: lonE6,
            priority: priority,
            createdAt: block.timestamp,
            reporter: msg.sender
        });

        reports.push(r);
        uint256 id = reports.length - 1;

        emit ReportCreated(
            id,
            latE6,
            lonE6,
            priority,
            block.timestamp,
            msg.sender
        );

        return id;
    }

    function getReports() external view returns (Report[] memory) {
        return reports;
    }

    function getReportsCount() external view returns (uint256) {
        return reports.length;
    }
}
