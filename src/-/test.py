#!/usr/bin/env python3
# coding: utf8
import unittest
import os
from lib import Lib
class TestNtLite(unittest.TestCase):
    def setUp(self): pass
    def tearDown(self): pass
    def test_method(self):
        self.assertEqual('test', Lib().method())
    def test_error(self):
        with self.assertRaises(ValueError) as cm:
            Lib().error()
        self.assertEqual(cm.exception.args[0], 'This is a Error!!')


if __name__ == '__main__':
    unittest.main()
